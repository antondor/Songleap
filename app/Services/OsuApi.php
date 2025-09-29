<?php

namespace App\Services;

use GuzzleHttp\Client as GClient;
use GuzzleHttp\Exception\GuzzleException;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;

class OsuApi
{
    private $baseUrl;
    private $client;

    public function __construct()
    {
        $this->baseUrl = "https://osu.ppy.sh/api/v2/";
        $this->client = new GClient();
    }

    private function request(User $user, string $method, string $url, array $data = [])
    {
        $accessToken = $this->getAccessToken($user);

        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $accessToken,
            'Accept-Language' => 'en',
        ];

        $options = ['headers' => $headers];

        if ($method === 'POST' && !empty($data)) {
            $options['json'] = $data;
        }

        try {
            $res = $this->client->request($method, $this->baseUrl . $url, $options);
        } catch (GuzzleException $e) {
            if ($e->getCode() === 401) {
                $accessToken = $this->refreshToken($user);

                $headers['Authorization'] = 'Bearer ' . $accessToken;
                $res = $this->client->request($method, $this->baseUrl . $url, ['headers' => $headers]);
            } else {
                throw $e;
            }
        }

        return json_decode($res->getBody()->getContents(), true);
    }

    private function getAccessToken(User $user): string
    {
        if (!$user->osu_refresh_token) {
            throw new \Exception("User {$user->id} has no refresh token");
        }

        if (!$user->osu_access_token || !$user->osu_token_expires_at || now()->greaterThan($user->osu_token_expires_at)) {
            return $this->refreshToken($user);
        }

        return $user->osu_access_token;
    }

    private function refreshToken(User $user): string
    {
        $refreshToken = $user->osu_refresh_token;

        if (!$refreshToken) {
            throw new \Exception("No refresh token available for user {$user->id}");
        }

        $response = $this->client->request('POST', 'https://osu.ppy.sh/oauth/token', [
            'form_params' => [
                'client_id'     => config('services.osu.client_id'),
                'client_secret' => config('services.osu.client_secret'),
                'grant_type'    => 'refresh_token',
                'refresh_token' => $refreshToken,
            ],
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        if (!isset($data['access_token']) || !isset($data['expires_in'])) {
            throw new \Exception("Failed to refresh token for user {$user->id}");
        }

        $user->update([
            'osu_access_token'     => $data['access_token'],
            'osu_token_expires_at' => now()->addSeconds($data['expires_in']),
        ]);

        return $data['access_token'];
    }

    public function getBeatmapset(User $user, int $beatmapsetId)
    {
        return $this->request($user, 'GET', 'beatmapsets/' . $beatmapsetId);
    }

    public function searchBeatmapsets(User $user, string $from, string $to, string $mode)
    {
        $filters[] = 'ranked>=' . $from;
        $filters[] = 'ranked<=' . $to;

        $fullQ = implode(' ', $filters);
        $endpoint = 'beatmapsets/search?q=' . urlencode($fullQ) . '&m=' . strtolower($mode);

        return $this->request($user, 'GET', $endpoint);
    }

    public function revokeToken(User $user)
    {
        return $this->request($user, 'DELETE', 'oauth/tokens/current');
    }
}
