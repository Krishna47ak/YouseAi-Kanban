import React, { useContext, useState } from "react";
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import { Task } from "@/app/(pages)/myboard/page";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { Context as DataContext } from '@/context/dataContext';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


interface ColumnProps {
    title: string;
    tasks: Task[];
    droppableId: string;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, droppableId }) => {
    const { fetchTasks } = useContext(DataContext)
    const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [isDelete, setIsDelete] = useState(false);
    const [loading, setLoading] = useState(false)

    const openDeleteModal = (taskId: string) => {
        setIsDelete(true);
        setTaskId(taskId);
    };

    const closeDeleteModal = () => {
        setIsDelete(false);
        setTaskId(null);
    };

    const deleteTask = async (id: string) => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.DOMAIN}/api/deleteTask/${id}`, {
                method: "DELETE"
            });
            const data = await res.json()
            if (data?.success) {
                toast.success("Task deleted successfully",
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#ba3030',
                            color: '#fff',
                        }
                    }
                )
                fetchTasks()
            } else {
                throw new Error("Something went wrong")
            }
            closeDeleteModal()
        } catch (err) {
            setLoading(false)
            toast.error("Deleting credentials unsuccessful")
            console.error(err);
        }
    }

    return (
        <div className="flex-1">
            <div className="flex gap-1 text-white">
                <h2 className="text-sm font-semibold mb-4 uppercase">
                    {title}
                </h2>
            </div>

            <Droppable droppableId={droppableId}>
                {(provided: DroppableProvided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="dark:bg-gray-800 bg-gray-300 rounded-lg p-4"
                    >
                        {tasks?.map((task, index) => (
                            <Draggable
                                key={task._id}
                                draggableId={task?._id!}
                                index={index}
                            >
                                {(provided: DraggableProvided) => (
                                    <div
                                        className="bg-purple-900 rounded p-2 px-4 mb-2 text-white flex justify-between"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onMouseEnter={() =>
                                            setHoverIndex(index)
                                        }
                                        onMouseLeave={() => setHoverIndex(null)}
                                    >
                                        <div className="w-full" >
                                            <p className="text-xl mb-2" >{task?.title}</p>
                                            <p className="text-gray-300" >{task?.description}</p>
                                        </div>

                                        {hoverIndex === index && (
                                            <div>
                                                <Dialog open={isDelete} onOpenChange={() => openDeleteModal(task._id!)} >
                                                    <DialogTrigger className="text-xs text-red-500 mt-1 cursor-pointer" >Delete</DialogTrigger>
                                                    <DialogContent className="w-[90%]" >
                                                        <DialogTitle>You are going to delete this task!!</DialogTitle>
                                                        <Modal
                                                            closeModal={closeDeleteModal}
                                                            title="Are you sure you want to delete this task?"
                                                            value={taskId!}
                                                            action={deleteTask}
                                                            isDelete={isDelete}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
