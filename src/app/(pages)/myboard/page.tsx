"use client"

import Column from "@/components/Column";
import { DropResult, DragDropContext } from "@hello-pangea/dnd";
import { useContext, useEffect, useState } from "react";
import { Context as DataContext } from '@/context/dataContext';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image";

// interface DragResult {
//     source: {
//         droppableId: string;
//         index: number;
//     };
//     destination: {
//         droppableId: string;
//         index: number;
//     } | null;
//     draggableId: string;
// }

export interface Task {
    _id: string | undefined;
    title: string | undefined;
    status: string | undefined;
    description: string | undefined;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
    dueDate: Date | undefined;
}

const priorityOrder = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    undefined: 0,
};

const MyBoard = () => {
    const { state: { user: { onBoarded }, tasksData }, fetchTasks, createTask } = useContext(DataContext)
    const [tasks, setTask] = useState<Task[]>(tasksData);
    const [isCreate, setIsCreate] = useState(false);
    const [sortOption, setSortOption] = useState<'priority' | 'dueDate'>('priority');
    const router = useRouter();


    useEffect(() => {
        if (!onBoarded) {
            router.replace("/onboarding");
        }
    }, [onBoarded])


    useEffect(() => {
        if (tasksData?.length === 0) {
            fetchTasks()
        } else {
            setTask(tasksData)
        }
    }, [tasksData])


    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

        const draggedTask = tasks.find(
            (task) => task._id === draggableId
        );

        let updatedStatus

        switch (destination.droppableId) {
            case "todo":
                updatedStatus = "TODO";
                break;
            case "inProgress":
                updatedStatus = "IN_PROGRESS";
                break;
            case "completed":
                updatedStatus = "DONE";
                break;
            default:
                updatedStatus = draggedTask?.status;
        }

        const updatedTask: Task[] = tasks.map((task) => {
            if (task._id === draggableId) {
                return {
                    ...task,
                    status: updatedStatus,
                };
            }
            return task;
        });

        setTask(updatedTask);

        try {
            const body = JSON.stringify({ taskId: draggableId, status: updatedStatus })
            const res = await fetch(`${process.env.DOMAIN}/api/editTaskStatus`, {
                credentials: "include",
                method: "PUT",
                body,
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json()
            if (data?.success) {
                toast.success("Task status updated successfully")
            } else {
                throw new Error("Something went wrong")
            }
        } catch (err) {
            toast.error("Changing task status unsuccessful!!")
            console.error(err);
        }
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortOption === 'priority') {
            return (priorityOrder[b.priority || 'undefined'] || 0) - (priorityOrder[a.priority || 'undefined'] || 0);
        } else {
            return (new Date(a.dueDate?.toString() || 0).getTime() - new Date(b.dueDate?.toString() || 0).getTime());
        }
    });

    return (
        <div className="py-10 relative min-h-[calc(100vh-5rem)]">
            <div className="mb-5 ml-20 w-44" >
                <Select onValueChange={(e: any) => setSortOption(e as 'priority' | 'dueDate')} >
                    <SelectTrigger className="w-full bg-gray-300 text-black rounded-lg py-5">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="priority" className='uppercase'>Sort by Priority</SelectItem>
                        <SelectItem value="dueDate" className='uppercase'>Sort by Due Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid md:grid-cols-3 max-md:items-center w-[90%] max-w-[1500px] mx-auto md:gap-5 gap-10">
                    <div onClick={() => setIsCreate(true)} className="fixed bottom-16 right-10 bg-blue-600 p-2 px-3 rounded-full z-50" >

                        <Dialog open={isCreate} onOpenChange={() => setIsCreate(true)} >
                            <DialogTrigger className="mt-1 cursor-pointer" >
                                <Image src="/plus-icon.svg" width={35} height={35} alt="add" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle className="hidden"  >Create New Task</DialogTitle>
                                <Modal
                                    closeModal={() => setIsCreate(false)}
                                    title="Create New Task"
                                    isCreate={isCreate}
                                    action={createTask}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Column
                        title="Todo"
                        tasks={sortedTasks?.filter(
                            (task) => task.status === "TODO"
                        )}
                        droppableId="todo"
                    />
                    <Column
                        title="In Progress"
                        tasks={sortedTasks?.filter(
                            (task) => task.status === "IN_PROGRESS"
                        )}
                        droppableId="inProgress"
                    />
                    <Column
                        title="Completed"
                        tasks={sortedTasks?.filter(
                            (task) => task.status === "DONE"
                        )}
                        droppableId="completed"
                    />
                </div>
            </DragDropContext>
        </div>
    )
}

export default MyBoard