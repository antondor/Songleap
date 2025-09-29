import AppLayout from "@/layouts/app-layout";
import type {BreadcrumbItem} from "@/types";
import {Head, useForm, usePage} from "@inertiajs/react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {route} from "ziggy-js";
import {DualRangeSlider} from "@/components/ui/dual-range-slider";
import {useState} from "react";
import {SharedData} from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Create new lobby',
        href: '/create-lobbies',
    },
];

type LobbyFormInterface = {
    name: string;
    mode: string;
    image: File | null,
    years?: string | null;
};

export default function CreateLobby() {

    const { auth } = usePage<SharedData>().props;
    const { data, setData, post } = useForm<LobbyFormInterface>({
        name: auth.user.username + "'s Lobby",
        mode: "Standard",
        image: null,
        years: '2014,2025'
    });
    const [values, setValues] = useState([2014, 2025]);

    const submit = (e) => {
        e.preventDefault();

        post(route('lobbies.store'), {
            preserveScroll: true,
            onSuccess: () => {

            },
            onError: (exceptions: Record<string, string>) => {
                console.error(exceptions);
                for (const key in exceptions) {
                    if (Object.prototype.hasOwnProperty.call(exceptions, key)) {
                        toast.error(`${exceptions[key]}`);
                    }
                }
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new lobby" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-xl">
                <div className=" relative  md:min-h-min px-6 py-6">
                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Create new lobby
                    </h2>

                    <form onSubmit={submit}>
                        <div className="grid gap-4 py-4 lg:grid-cols-1">
                            <div>
                                <Label htmlFor="name" className="mb-2">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={"Lobby name"}
                                />
                            </div>

                            <div>
                                <Select
                                    value={data.mode}
                                    onValueChange={(val) => setData("mode", val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                        <SelectItem value="Taiko">Taiko</SelectItem>
                                        <SelectItem value="Mania">Mania</SelectItem>
                                        <SelectItem value="Catch">Catch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="description" className="mb-2">
                                    Year of maps
                                </Label>
                                <DualRangeSlider
                                    label={(value) => value}
                                    value={values}
                                    onValueChange={(val) => {
                                        setValues(val);
                                        setData("years", val.join(","));
                                    }}
                                    min={2014}
                                    max={2025}
                                    step={1}
                                />
                            </div>
                        </div>
                        <Button type="submit">Submit lobby</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
