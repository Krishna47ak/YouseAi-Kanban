import CreateTask from "./CreateTask";
import FormInput from "./FormInput";
import Input from "./Input";
import { Button } from "./ui/button";
import toast from "react-hot-toast";


const Modal = ({
    closeModal,
    title,
    action,
    value,
    isCreate,
    isEdit,
    isDelete,
}: {
    isCreate?: boolean;
    isDelete?: boolean;
    isEdit?: boolean;
    value?: string;
    action: Function;
    title: string;
    closeModal: () => void;
}) => {
    const submitHandler = (e: any) => {
        e.preventDefault()
        if (isEdit) {
            toast.success("Task Has Been Updated");
        } else if (isDelete) {
            action(value)
        }
        closeModal();
    };

    return (
        <div
            className="flex items-center justify-center w-full h-full bg-opacity-50"
        >
            <div
                className="bg-blue-900 rounded-lg p-6 text-white w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="flex justify-center w-full">
                    {isCreate ? (
                        <CreateTask action={action} closeModal={closeModal} />

                    ) : (
                        <form className="w-full" onSubmit={submitHandler}>
                            {isEdit && (
                                <Input
                                    type="text"
                                    name="newTask"
                                    placeholder="Enter new task name"
                                    fullWidth
                                />
                            )}

                            <div className="mt-5 flex justify-center gap-5">
                                <Button type="submit" >Confirm</Button>
                                <Button onClick={closeModal} >Cancel</Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
