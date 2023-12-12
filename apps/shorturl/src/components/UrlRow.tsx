import {
	Pencil2Icon,
	TrashIcon,
	InfoCircledIcon,
	CopyIcon,
} from "@radix-ui/react-icons";
import { UrlRowProps } from "../types/Types";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// const server = import.meta.env.VITE_SERVER;
export const UrlRow: React.FC<UrlRowProps> = ({
	index,
	page,
	item,
	openEditModal,
	handleRemove,
}) => {
	const [copied, setCopied] = useState<boolean>(false);
	const navigate = useNavigate();
	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 3000);
	};
	return (
		<tr className={`${index % 2 === 0 ? "bg-white" : ""} items-center`}>
			<td className="py-2 px-4 border-b">
				{index + 1 + (page * 10 - 10)}
			</td>
			<td className="py-1 px-4 border-b font-normal text-start">
				{item.title.charAt(0).toUpperCase() +
					item.title.slice(1).toLowerCase()}
			</td>

			<td className="py-1 px-4 border-b btn text-start">
				<a
					href={item.short_url}
					target="blank"
					className="cursor-pointer text-gray-600 underline"
				>
					{item.short_url}
				</a>
			</td>
			<td className="py-1 px-4 border-b text-center">
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
								height={18}
								width={18}
								color={copied ? "gainsboro" : "gray"}
							/>
						</button>
					</CopyToClipboard>
				</div>
			</td>
			
			<td className="py-1 px-4 border-b text-center capitalize">
				{item.status}
			</td>
			
			<td className="py-1 px-4 border-b">
				<div className="flex justify-center items-center h-full">
					<button
						className="rounded focus:outline-none focus:shadow-outline"
						onClick={() => navigate(`/analytics/${item.short_id}`)}
					>
						<InfoCircledIcon height={18} width={18} />
					</button>
				</div>
			</td>
			<td className="py-1 px-4 border-b">
				<div className="flex justify-center items-center h-full">
					<button
						className="focus:outline-none focus:shadow-outline"
						onClick={() => openEditModal(item)}
					>
						<Pencil2Icon width={18} height={18} />
					</button>
				</div>
			</td>
			<td className="py-1 px-4 border-b">
				<div className="flex justify-center items-center h-full">
					<button
						className="focus:outline-none focus:shadow-outline"
						onClick={() => handleRemove(item)}
					>
						<TrashIcon width={18} height={18} color="red" />
					</button>
				</div>
			</td>
		</tr>
	);
};
