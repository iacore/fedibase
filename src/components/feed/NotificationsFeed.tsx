import { IconList, IconListDetails, IconRocket, IconStarFilled } from "@tabler/icons-preact";
import { SelectItem } from "components/forms/Select2";
import { Notification as NotificationElement } from "components/posts/Notification";
import { Entity } from "megalodon";
import { useState } from "preact/hooks";
import Feed, { FeedType } from "./Feed";
import { memo } from "preact/compat";
import SmallSelect2, { SelectDirection } from "components/forms/SmallSelect2";

const modes: SelectItem[] = [
	{
		icon: IconList,
		text: "All posts",
		value: "all",
		description: "Show all posts",
	},
	{
		icon: IconListDetails,
		text: "Mentions",
		value: "mention",
		description: "Only show mentions",
	},
	{
		icon: IconRocket,
		text: "Boosts",
		value: "reblogs",
		description: "Only show boosts",
	},
	{
		icon: IconStarFilled,
		text: "Favourites",
		value: "favourites",
		description: "Only show favourites",
	},
];

function NotificationsFeed({ withTitle = true }: { withTitle?: boolean }) {
	const [mode, setMode] = useState(modes[0]);

	return (
		<div className="flex flex-col gap-y-6 w-full max-w-full min-h-full font-inter">
			{withTitle && (
				<div className="flex flex-row justify-between items-center">
					<h3 className="text-lg font-bold dark:text-gray-50">Notifications</h3>
					<SmallSelect2
						items={modes}
						defaultValue={0}
						onChange={(item) => {
							setMode(item);
						}}
						direction={SelectDirection.Left}
					/>
				</div>
			)}
			
				<ul className="flex overflow-y-scroll flex-col overflow-x-hidden gap-y-2 max-w-full h-full divide-y-2 dark:divide-gray-700 no-scroll">
					<Feed<Entity.Notification> type={FeedType.Notifications}
						onChange={(entities: Entity.Notification[]) => {
							if (!localStorage.getItem("lastReadNotification")) localStorage.setItem("lastReadNotification", Math.max(...entities.map(entity => {
								return Number(entity.id);
							})).toString())

							if (Notification.permission === "denied" || Notification.permission === "default") return;
							entities.forEach(entity => {
								if (Number(entity.id) <= Number(localStorage.getItem("lastReadNotification"))) return;

								let title;
								switch (entity.type) {
									case "favourite":
										title = `${entity.account.display_name} favourited your post`;
										break;
									case "reblog":
										title = `${entity.account.display_name} boosted your post`;
										break;
									case "mention":
									default:
										title = `${entity.account.display_name}`;
										break
								}

								let notif = new Notification(title, {
									body: entity.status?.plain_content ?? "",
									icon: entity.account.avatar_static
								});


								notif.onclick = () => {
									window.parent.focus();
									notif.close();
								}

								localStorage.setItem("lastReadNotification", entity.id.toString());
							})
						}}
						entityElement={NotificationElement}
						options={{
							id: "",
							filter: mode.value
						}}/>
				</ul>
		</div>
	);
}

export default memo(NotificationsFeed);