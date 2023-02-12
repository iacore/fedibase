/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import InfiniteScrollPosts from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";

export const HomeFeed = () => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const postsRef = useRef(posts);

	useEffect(() => {
		client?.getHomeTimeline({
			limit: 20
		}).then((res: Response<Array<Entity.Status>>) => {
			setPosts(res.data);
			postsRef.current = res.data
		});

		const interval = setInterval(() => {
			client
				?.getHomeTimeline({
					since_id: postsRef.current[0].id,
				})
				.then(res => {
					setPosts(n => [...res.data, ...n]);
					postsRef.current = [...res.data, ...postsRef.current];
				});
		}, 15000);

		return () => clearInterval(interval);
	}, [client]);

	return (
		<WithLoader variable={posts}>
			<div className="flex flex-col gap-y-5 px-2 mt-10 w-full h-full">
				<InfiniteScrollPosts posts={posts} loadNewPosts={() => {
					console.log("loading more posts...");
					
					/* client
						?.getHomeTimeline({
							max_id: posts[posts.length - 1].id,
						})
						.then(res => {
							setPosts(posts.concat(res.data));
						}); */
				}}/>
			</div>
		</WithLoader>
	);
};
