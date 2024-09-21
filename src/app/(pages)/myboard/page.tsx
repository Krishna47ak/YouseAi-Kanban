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
    const { state: { user: { onBoarded }, tasksData, isAuthenticated }, fetchTasks, createTask } = useContext(DataContext)
    const [tasks, setTask] = useState<Task[]>(tasksData);
    const [updatedTasks, setUpdatedTask] = useState<Task[]>(tasksData);
    const [isCreate, setIsCreate] = useState(false);
    const [sortOption, setSortOption] = useState<'priority' | 'dueDate'>('priority');
    const [filterByPriorityOption, setFilterByPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'>('NONE');
    const router = useRouter();


    useEffect(() => {
        if (!onBoarded && isAuthenticated) {
            router.replace("/onboarding");
        }
    }, [onBoarded, isAuthenticated])


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

    const filteredTasks = filterByPriorityOption === 'NONE'
        ? tasks
        : tasks.filter(task => task.priority === filterByPriorityOption);

    useEffect(() => {
        let sortedTasks = [...tasks].sort((a, b) => {
            if (sortOption === 'priority') {
                return (priorityOrder[b.priority || 'undefined'] || 0) - (priorityOrder[a.priority || 'undefined'] || 0);
            } else {
                return (new Date(a.dueDate?.toString() || 0).getTime() - new Date(b.dueDate?.toString() || 0).getTime());
            }
        });

        if (filterByPriorityOption != 'NONE') {
            const filteredTasks = sortedTasks.filter(task => task.priority === filterByPriorityOption);
            sortedTasks = filteredTasks;
        }

        setUpdatedTask(sortedTasks)
    }, [sortOption, filterByPriorityOption, tasks])


    return (
        <div className="py-10 relative min-h-[calc(100vh-5rem)] overflow-hidden">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-5 ml-5 mr-5 sm:mr-0 sm:ml-10 lg:ml-20 sm:w-96" >
                <Select onValueChange={(e: any) => setSortOption(e as 'priority' | 'dueDate')} >
                    <SelectTrigger className="w-full bg-gray-300 text-black rounded-lg py-5">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="priority" className='uppercase'>Sort by Priority</SelectItem>
                        <SelectItem value="dueDate" className='uppercase'>Sort by Due Date</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(e: any) => setFilterByPriority(e as 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE')} >
                    <SelectTrigger className="w-full bg-gray-300 text-black rounded-lg py-5">
                        <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="NONE" className='uppercase'>NONE</SelectItem>
                        <SelectItem value="HIGH" className='uppercase'>Filter High priority</SelectItem>
                        <SelectItem value="MEDIUM" className='uppercase'>Filter Medium priority</SelectItem>
                        <SelectItem value="LOW" className='uppercase'>Filter Low priority</SelectItem>
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
                            <DialogContent className="w-[90%]" >
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
                        tasks={updatedTasks?.filter(
                            (task) => task.status === "TODO"
                        )}
                        droppableId="todo"
                    />
                    <Column
                        title="In Progress"
                        tasks={updatedTasks?.filter(
                            (task) => task.status === "IN_PROGRESS"
                        )}
                        droppableId="inProgress"
                    />
                    <Column
                        title="Completed"
                        tasks={updatedTasks?.filter(
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