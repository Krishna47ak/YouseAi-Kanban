import { Button } from "@/components/ui/button";
import Link from "next/link";

const Landing = () => {
    return (
        <div className="bg-[url('/kanban-bg.jpg')] bg-center bg-cover bg-fixed h-[calc(100vh-5rem)] relative w-full overflow-hidden text-white">
            <div className="flex h-full items-center p-20 min-h-screen">
                <div className="">
                    <div className="flex flex-col justify-center max-md:items-center space-y-4 max-md:text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                Unlock Your Productivity Potential
                            </h2>
                            <p className="max-w-[500px] md:text-xl text-gray-300">
                                Transform your projects with our intuitive Kanban board and achieve success every day.
                            </p>
                        </div>
                        <Link href="/signup">
                            <Button>Start planning now &#8594;</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;