import { Dialog, Transition } from "@headlessui/react";
import { IconBell, IconMenu2, IconX } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import { useState, Fragment } from "react";

export default function MobileNavbar() {
	const [open, setOpen] = useState(false);
	
	return (
		<>
			<div className="flex fixed inset-x-0 top-0 z-30 justify-between px-6 py-4 bg-white border-b md:hidden">
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						setOpen(o => !o);
					}}>
					<IconMenu2 className="" />
				</Button>
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						setOpen(o => !o);
					}}>
					<IconBell className="" />
				</Button>
			</div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setOpen}>
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
							<div className="flex fixed inset-y-0 right-0 pl-10 max-w-full pointer-events-none">
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
											<div className="flex overflow-x-hidden relative px-4 mt-6 sm:px-6">
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