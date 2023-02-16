import { Dialog, Transition } from "@headlessui/react";
import { IconBell, IconMenu2, IconPaperclip, IconPencilPlus, IconPlus, IconX } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import SmallSelect from "components/forms/SmallSelect";
import { Response } from "megalodon";
import SmallLogo from "components/logo/SmallLogo";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import Link from "next/link";
import { useState, Fragment, useContext, FormEvent, MutableRefObject, useRef } from "react";
import toast from "react-hot-toast";

export default function MobileNavbar() {
	const [open, setOpen] = useState(false);
	const [state, setState]: any = useContext(StateContext);
	const client = useContext(AuthContext);
	const [loading, setLoading] = useState<boolean>(false);
	const textareaRef: MutableRefObject<HTMLTextAreaElement> = useRef(null);

	const submitForm = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		client
			.postStatus(event.target["comment"].value, {
				in_reply_to_id: state?.replyingTo?.id ?? undefined,
				visibility: "public",
			})
			.then((res: Response<Entity.Status>) => {
				if (res.status == 200) {
					toast("Post sent!", {
						icon: "👍",
					});
				}
			})
			.finally(() => {
				setLoading(false);
				textareaRef.current.value = "";
				setState((s: any) => ({
					...s,
					replyingTo: null,
					mobileEditorOpened: false,
				}));
			});
	};
	
	return (
		<>
			<div className="flex fixed inset-x-0 top-0 z-30 justify-between items-center px-6 py-3 bg-white border-b md:hidden">
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						setOpen(o => !o);
					}}>
					<IconMenu2 className="" />
				</Button>
				<Link href="/">
					<SmallLogo size="w-10 !h-10" />
				</Link>
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						setOpen(o => !o);
					}}>
					<IconBell className="" />
				</Button>
			</div>
			<div className="fixed right-0 bottom-0 z-30 mx-7 my-7 md:hidden">
				<Button
					onClick={() => {
						setState(s => ({
							...s,
							mobileEditorOpened: true,
						}));
					}}
					style="gray"
					className="bg-gray-200 !p-3">
					<IconPencilPlus className="w-10 h-10" />
				</Button>
			</div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-40" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 backdrop-filter backdrop-blur-sm transition-opacity bg-gray-400/40" />
					</Transition.Child>

					<div className="overflow-hidden fixed inset-0">
						<div className="overflow-hidden absolute inset-0">
							<div className="flex fixed inset-y-0 right-0 ml-10 max-w-full pointer-events-none">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-500 sm:duration-700"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-500 sm:duration-700"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full">
									<Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
										<Transition.Child
											as={Fragment}
											enter="ease-in-out duration-500"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in-out duration-500"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="flex absolute top-0 left-0 pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4"></div>
										</Transition.Child>
										<div className="flex overflow-y-scroll flex-col py-6 h-full bg-white shadow-xl">
											<div className="flex justify-between px-4 sm:px-6">
												<Dialog.Title className="text-lg font-medium text-gray-900">
													Notifications
												</Dialog.Title>
												<button
													type="button"
													className="text-gray-300 rounded-md hover:text-white focus:outline-none"
													onClick={() => setOpen(false)}>
													<span className="sr-only">Close panel</span>
													<IconX className="w-6 h-6" aria-hidden="true" />
												</button>
											</div>
											<div className="flex overflow-y-scroll relative px-4 mt-6 max-w-full h-full sm:px-6">
												<NotificationsFeed withTitle={false} />
											</div>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}