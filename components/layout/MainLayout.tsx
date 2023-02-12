import LeftSidebar from "components/sidebar/LeftSidebar";
import NotificationsFeed from "components/sidebar/NotificationsFeed";

export default function MainLayout({ children }) {
	return (
		<div className="flex flex-col w-full min-h-screen bg-gray-50 duration-200">
			<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.3rem]">
				<main className="grow">
					<div className="grid relative grid-cols-4 mx-auto max-w-full h-full md:grid-cols-11">
						<div className="hidden overflow-y-scroll p-4 max-h-screen md:col-span-2 md:block">
							<LeftSidebar />
						</div>
						<div className="overflow-y-hidden col-span-6 max-h-screen border-x">
							{children}
						</div>
						<div className="hidden overflow-x-hidden p-4 min-w-0 max-h-screen md:col-span-3 md:flex">
							<NotificationsFeed />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}