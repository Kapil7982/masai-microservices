import React, { useState } from "react";
import {
	CopyIcon,
	InfoCircledIcon,
	Pencil2Icon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { UrlCardProps } from "../types/Types";
import CopyToClipboard from "react-copy-to-clipboard";
// const server = import.meta.env.VITE_SERVER;
export const UrlCard: React.FC<UrlCardProps> = ({
	item,
	openEditModal,
	handleRemove,
}) => {
	const [copied, setCopied] = useState<boolean>(false);
	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 3000);
	};
	return (
		<div className="w-full mb-2 bg-white rounded-lg overflow-hidden border border-solid border-gray-400 text-black">
			<div className="p-2">
				<div className="text-xl font-bold capitalize pb-1 flex justify-between items-center">
					<div>{item.title}</div>
					<div className="flex justify-center items-center gap-2">
						<div
							role="tooltip"
							title={copied ? "Copied" : "Copy Url"}
							className="flex justify-center items-center"
						>
							<CopyToClipboard
								text={item.short_url}
								onCopy={() => setCopied(true)}
							>
								<button onClick={handleCopy}>
									<CopyIcon
										height={22}
										width={22}
										color={copied ? "gainsboro" : "black"}
									/>
								</button>
							</CopyToClipboard>
						</div>
						<Link
							to={`/analytics/${item.short_id}`}
							className="flex justify-center items-center"
						>
							<button className="rounded focus:outline-none focus:shadow-outline">
								<InfoCircledIcon height={22} width={22} />
							</button>
						</Link>
						<button
							className="focus:outline-none focus:shadow-outline"
							onClick={() => openEditModal(item)}
						>
							<Pencil2Icon width={22} height={22} />
						</button>
						<button
							className="focus:outline-none focus:shadow-outline"
							onClick={() => handleRemove(item)}
						>
							<TrashIcon width={22} height={22} color="red" />
						</button>
					</div>
				</div>
				<div className="flex flex-col text-lg">
					<span className="mr-2 flex">
						<a
							href={item.short_url}
							target="blank"
							className="cursor-pointer underline italic"
						>
							{item.short_url}
						</a>
					</span>
					<span className="mr-2 text-lg">status: {item.status}</span>
				</div>
			</div>
		</div>
	);
};
