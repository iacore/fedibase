/* eslint-disable @next/next/no-img-element */
import { Popover, Transition } from "@headlessui/react";
import { IconMessage } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import { Entity } from "megalodon";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { fromNow, withEmojis } from "utils/functions";
import InteractionBar from "./InteractionBar";
import PostImages from "./PostImages";

export default function Status({
	status,
	type,
	showInteraction = true,
}: {
	status: Entity.Status;
	type: "notification" | "post"; // Notification renders slightly different than a normal post
	showInteraction?: boolean;
}) {
	const [expand, setExpand] = useState<boolean>(false);
	const [showText, setShowText] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);
	const [state, setState]: any = useContext(StateContext);

	return (
		<div className="flex flex-col max-w-full">
			<div className="flex flex-row max-w-full">
				<a href={`/users/${status.account.id}`} onClick={e => {
					if (!e.ctrlKey && !e.metaKey) {
						e.preventDefault();
						setState(s => ({
							...s,
							params: {
								...s.params,
								id: status.account.id,
							},
							notificationsOpened: false,
						}));
						history.pushState(null, null, `/users/${status.account.id}`);
					}
				}} className="flex-shrink-0 mr-4">
					<img
						loading="lazy"
						alt={`${status.account.acct}'s avatar`}
						src={status.account.avatar}
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} bg-white bg-dark rounded border border-gray-300 dark:border-gray-700 `}
					/>
				</a>
				<div className="flex flex-col min-w-0 grow">
					<div className="justify-between gap-x-2 text-[0.95rem] flex flex-row">
						<span className="flex overflow-hidden flex-col whitespace-nowrap md:inline text-ellipsis">
							<h4 className="inline font-bold dark:text-gray-200" title={status.account.display_name}>
								{withEmojis(status.account.display_name, status.account.emojis)}
							</h4>
							<h6
								title={status.account.acct}
								className="inline overflow-hidden ml-0 text-gray-500 overflow-ellipsis dark:text-gray-400 md:ml-2">
								@{status.account.acct}
							</h6>
						</span>
						<div className="whitespace-nowrap">
							<a
								href={`/posts/${status.id}`}
								onClick={e => {
									if (!e.ctrlKey && !e.metaKey) {
										e.preventDefault();
										setState(s => ({
											...s,
											params: {
												...s.params,
												id: status.id,
											},
											notificationsOpened: false,
										}));
										history.pushState(null, null, `/posts/${status.id}`);
									}
								}}
								className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
								{fromNow(new Date(status.created_at))}
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-y-1">
						{status.in_reply_to_id && <ReplyTo status={status} />}
						<SensitiveTextSpoiler
							status={status}
							showText={showText}
							setShowText={setShowText}
						/>

						<div
							className="relative w-full text-sm"
							style={{
								overflow: expand ? "" : "hidden",
								maxHeight: expand ? "" : "8rem",
							}}>
							<p
								ref={textRef}
								className={`mt-1 rounded duration-200 status-text dark:text-gray-50 ${
									status.sensitive && !showText && "filter blur-lg"
								}`}>
								{withEmojis(status.content, status.emojis)}
							</p>
						</div>

						{textRef?.current?.offsetHeight > 128 && (
							<>
								<hr />
								<button
									className="mx-auto w-full text-sm text-blue-800 dark:text-blue-100 hover:underline"
									onClick={() => {
										setExpand(!expand);
									}}>
									{expand === true ? "Less" : "More"}
								</button>
							</>
						)}
					</div>
					<PostImages status={status} />
				</div>
			</div>

			{showInteraction && <InteractionBar status={status} />}
		</div>
	);
}

export function DummyStatus({ type = "post" }: { type: "post" | "notification" }) {
	const [random, setRandom] = useState<number>(0);

	useEffect(() => {
		setRandom(Math.random());
	}, [])
	return (
		<div className="flex flex-col max-w-full" aria-hidden={true}>
			<div className="flex flex-row max-w-full">
				<span className="flex-shrink-0 mr-4">
					<div
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} bg-gray-300 dark:bg-gray-500/40 animate-pulse rounded border border-gray-300 dark:border-gray-700 `}
					/>
				</span>
				<div className="flex flex-col min-w-0 grow">
					<div className="justify-between gap-x-2 text-[0.95rem] flex flex-row">
						<span className="flex overflow-hidden flex-col gap-y-1 whitespace-nowrap md:inline text-ellipsis">
							<h4
								style={{
									width: `${random * 100 + 100}px`,
								}}
								className="inline-block h-4 font-bold bg-gray-300 rounded animate-pulse dark:text-gray-200 dark:bg-gray-500/40"></h4>
							<h6
								style={{
									width: `${random * 150 + 100}px`,
								}}
								className="inline-block overflow-hidden ml-0 w-12 h-4 text-gray-500 overflow-ellipsis rounded animate-pulse bg-gray-v dark:text-gray-400 md:ml-2 dark:bg-gray-500/40"></h6>
						</span>
						<div className="whitespace-nowrap">
							<span className="inline-block w-12 h-4 text-sm text-gray-700 bg-gray-300 rounded animate-pulse dark:text-gray-300 hover:underline dark:bg-gray-500/40"></span>
						</div>
					</div>
					<div className="flex flex-col gap-y-1">
						<div className="relative w-full text-sm">
							<p
								className={`mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40`}></p>
							<p
								className={`mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40`}></p>
							<p
								style={{
									width: `${random * 100}%`,
								}}
								className={`mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40`}></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ReplyTo({ status }: { status: Entity.Status }) {
	const [replyStatus, setReplyStatus] = useState<Entity.Status>();
	const client = useContext(AuthContext);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		// If the post is a reply, get the previous post's contents
		if (status.in_reply_to_id && !replyStatus)
			client?.getStatus(status.in_reply_to_id).then(data => {
				setReplyStatus(data.data);
			});
	}, [client, replyStatus, status.in_reply_to_id]);

	return (
		<div
			className="inline relative bg-slate-300/0"
			onMouseEnter={e => {
				setOpen(true);
			}}
			onMouseLeave={e => {
				setOpen(false);
			}}>
			<span className="text-xs text-gray-600 hover:underline dark:text-gray-300">
				<IconMessage className="inline mr-1 w-4 h-4" aria-hidden={true} />
				Replying to{" "}
				{replyStatus &&
					withEmojis(replyStatus.account.display_name, replyStatus.account.emojis)}
			</span>
			<Transition
				as={Fragment}
				show={open}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1">
				<div className="absolute left-0 z-10 px-4 py-3 max-w-sm bg-gray-50 bg-dark rounded dark:border-gray-700 border transform translate-x-[-5.55rem] lg:max-w-3xl">
					{replyStatus && <Status status={replyStatus} type="post" />}
				</div>
			</Transition>
		</div>
	);
}

function SensitiveTextSpoiler({
	status,
	showText,
	setShowText,
}: {
	status: Entity.Status;
	showText: boolean;
	setShowText: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<>
			{status.sensitive && (
				<div className="flex gap-x-2 items-center font-bold dark:text-gray-100">
					{status.spoiler_text == "" ? "Marked as sensitive" : status.spoiler_text}

					<Button
						style="gray"
						className="!py-1 !px-2"
						onClick={() => {
							setShowText(t => !t);
						}}>
						{showText ? "Hide" : "Show"}
					</Button>
				</div>
			)}
		</>
	);
}
