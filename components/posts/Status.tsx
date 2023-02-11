/* eslint-disable @next/next/no-img-element */
import Button from "components/buttons/Button";
import { Entity } from "megalodon";
import Link from "next/link";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import InteractionBar from "./InteractionBar";
import PostImages from "./PostImages";

export default function Status({
	status,
	type,
	showInteraction = true
}: {
	status: Entity.Status;
	type: "notification" | "post";
	showInteraction?: boolean;
}) {
	const [expand, setExpand] = useState<boolean>(false);
	const [showText, setShowText] = useState<boolean>(false);	
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className="flex flex-col max-w-full">
			<div className="flex flex-row max-w-full">
				<Link href={`/users/@${status.account.id}`} className="flex-shrink-0 mr-4">
					<img
						alt={status.account.acct}
						src={status.account.avatar}
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} text-gray-300 bg-white rounded border border-gray-300`}
					/>
				</Link>
				<div className="flex flex-col min-w-0 grow">
					<div className="flex flex-col gap-x-2 text-[0.95rem] md:inline-block">
						<h4 className="inline flex-shrink font-bold">
							{status.account.display_name}
						</h4>
						<h6
							title={status.account.acct}
							className="inline overflow-hidden ml-0 text-gray-500 overflow-ellipsis md:ml-2">
							@{status.account.acct}
						</h6>
					</div>
					<div className="flex flex-col gap-y-1">
						<SensitiveTextSpoiler status={status} showText={showText} setShowText={setShowText}/>

						<div
							className="relative w-full text-sm"
							style={{
								overflow: expand ? "" : "hidden",
								maxHeight: expand ? "" : "8rem",
							}}>
							<p
								ref={textRef}
								className={`mt-1 rounded duration-200 ${
									status.sensitive && !showText && "filter blur-lg"
								}`}
								dangerouslySetInnerHTML={{ __html: status.content }}></p>
						</div>
						
						{textRef?.current?.offsetHeight > 128 && (
							<>
								<hr />
								<button
									className="mx-auto w-full text-sm text-blue-800 hover:underline"
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

			{showInteraction && (
				<InteractionBar status={status} />
			)}
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
				<div className="flex gap-x-2 items-center font-bold">
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