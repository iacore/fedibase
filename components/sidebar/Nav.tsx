/* eslint-disable @next/next/no-img-element */
import { Transition } from "@headlessui/react";
import { IconHome, IconUsers, IconWorld } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { classNames } from "utils/functions";

const navigation = [
	{
		name: "Home",
		icon: IconHome,
		href: "/",
		type: "",
	},
	{
		name: "Instance",
		icon: IconUsers,
		href: "/local",
		type: "local",
	},
	{
		name: "Federated",
		icon: IconWorld,
		href: "/federated",
		type: "federated"
	},
];

export default function Nav() {
	const client = useContext(AuthContext);
	const [state, setState]: any = useContext(StateContext);
	
	const [account, setAccount] = useState<Entity.Account>();
	const [instance, setInstance] = useState<Entity.Instance>();

	useEffect(() => {
		if (window) {
			client?.verifyAccountCredentials().then(data => {
				setAccount(data.data);
			});

			if (localStorage.getItem("instanceData")) {
				setInstance(JSON.parse(localStorage.getItem("instanceData")));
			} else {
				client?.getInstance().then(data => {
					// Caches instance data
					localStorage.setItem("instanceData", JSON.stringify(data.data));
					setInstance(data.data);
				});
			}
		}
	}, [client])

	return (
		<div className="hidden fixed top-0 bottom-0 left-0 z-50 flex-col flex-1 col-span-1 min-h-0 bg-gradient-to-b border-r dark:border-gray-700 bg-light dark:bg-dark lg:flex">
			<div className="flex overflow-y-auto flex-col flex-1 pt-5 pb-4">
				<Link
					href="/"
					onClick={e => {
						e.preventDefault();
						history.pushState(null, null, "/");
						setState(s => ({
							...s,
							params: "/",
						}));
					}}
					className="flex flex-shrink-0 justify-center items-center px-2">
					<img src={instance?.thumbnail} className="w-8 h-8 rounded" alt="" />
				</Link>
				<nav className="flex-1 px-2 mt-5 space-y-1" aria-label="Sidebar">
					{navigation.map(item => (
						<NavElement item={item} key={item.name} />
					))}
				</nav>
				<Link href={`/users/${account?.id}`} className="flex justify-center items-center">
					<img
						src={account?.avatar}
						className="w-9 h-9 rounded border dark:border-gray-700"
						alt=""
					/>
				</Link>
			</div>
		</div>
	);
}

function NavElement({ item }: { item: any }) {
	const [current, setCurrent] = useState<boolean>(false);
	const [state, setState]: any = useContext(StateContext);
	let [showTooltip, setShowTooltip] = useState<boolean>(false);

	useEffect(() => {
		setCurrent(typeof window !== "undefined" ? window.location.pathname === item.href : false);
	}, [item.href])

	return (
		<div className="flex flex-row items-center">
			<Link
				href={item.href}
				onClick={e => {
					if (!e.ctrlKey && !e.metaKey) {
						e.preventDefault();
						setState(s => ({
							...s,
							params: {
								...s.params,
								type: item.type,
							},
						}));
						history.pushState(null, null, item.href);
					}
				}}
				className={classNames(
					current
						? "bg-gray-300/40 dark:bg-gray-700/40"
						: "hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75",
					"flex justify-center items-center p-2 mx-2 text-sm font-medium rounded-md duration-200 group",
				)}
				onMouseEnter={() => {
					setShowTooltip(true);
				}}
				onMouseLeave={() => {
					setShowTooltip(false);
				}}>
				<item.icon
					className="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-gray-300"
					aria-hidden="true"
				/>
			</Link>
			<Transition
				as={Fragment}
				show={showTooltip}
				enter="transform transition duration-150"
				enterFrom="opacity-0 scale-50"
				enterTo="opacity-100 scale-100"
				leave="transform duration-150 transition ease-in-out"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95">
				<div
					role="tooltip"
					className="inline-block absolute z-10 px-3 py-2 ml-14 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm dark:text-gray-100 bg-dark dark:border-gray-700 font-inter">
					{item.name}
				</div>
			</Transition>
		</div>
	);
}
