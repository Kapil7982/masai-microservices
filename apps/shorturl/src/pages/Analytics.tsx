// Library import
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useParams, Link } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

import {
	CalendarIcon,
	ExternalLinkIcon,
	Link2Icon,
	PersonIcon,
	StarIcon,
	StackIcon,
	EyeOpenIcon,
	CopyIcon,
	DownloadIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
// Component import
import StickyButton from "../components/StickyButton";
// Env import
const server = import.meta.env.VITE_SERVER;
// Types
interface UrlDetails {
	_id: string;
	original_url: string;
	short_id: string;
	expiration_date: string;
	starting_date: string;
	title: string;
	description: string;
	status: string;
	short_url: string;
	stats: {
		total_visitors: number;
		unique_visitors: number;
	};
}
interface AxiosResponse {
	url_details: UrlDetails;
}

interface VisitorData {
	_id: string;
	ip_address: string;
	visit_time: string;
	referrer: string;
}

const Analytics: React.FC = () => {
	const { short_id } = useParams<{ short_id: string }>();
	const [urlDetails, setUrlDetails] = useState<UrlDetails>({} as UrlDetails);
	const [visitors, setVisitors] = useState<VisitorData[]>([]);
	const [page, setPage] = useState<number>(1);
	const [copied1, setCopied1] = useState(false);
	const [copied2, setCopied2] = useState(false);

	const qrCodeRef = useRef(null);

	const exportQRCode = () => {
		const qrCodeElement = qrCodeRef.current;
		if (qrCodeElement) {
			toPng(qrCodeElement, { width: 400, height: 600 })
				.then((dataUrl) => {
					const link = document.createElement("a");
					link.href = dataUrl;
					link.download = "qrcode.png";
					link.click();
				})
				.catch((error) => {
					alert("Error while downloading QR Code");
					console.error("Error exporting QR code:", error);
				});
		}
	};
	const handleCopy1 = () => {
		setCopied1(true);
		setTimeout(() => {
			setCopied1(false);
		}, 3000);
	};
	const handleCopy2 = () => {
		setCopied2(true);
		setTimeout(() => {
			setCopied2(false);
		}, 3000);
	};
	const getUrlDetails = async (id: string) => {
		try {
			const { data } = await axios.get<AxiosResponse>(
				`${server}/log/${id}`,
			);
			setUrlDetails(data.url_details);
		} catch (error) {
			console.log(error);
		}
	};

	const getLogsData = async (id: string, page: number) => {
		try {
			const { data } = await axios.get<VisitorData[]>(
				`${server}/log/visitors/${id}?page=${page}`,
			);
			setVisitors(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (short_id) {
			getUrlDetails(short_id);
			getLogsData(short_id, page);
		}
	}, [page, short_id]);
	return (
		<div className="container mx-auto md:p-8 lg:pt-4 p-2">
			<div className=" w-full flex justify-end items-center mb-2">
				<Link to={"/all-urls"}>
					<StickyButton onClick={() => {}} label={"Go back"} />
				</Link>
			</div>
			{/* Url card */}
			<section className="text-gray-600 body-font rounded">
				<div className="container md:pb-3 mx-auto flex">
					<div className="mx-auto w-full shadow-2xl md:p-6 p-2 border-[2px] rounded border-blue-600">
						{urlDetails?.title || urlDetails?.description ? (
							<div className="w-full mb-1 px-4 py-2 relative shadow-md">
								<h1 className="title-font font-medium text-2xl mb-2 text-blue-600 capitalize">
									{urlDetails?.title}
								</h1>
								<div className="leading-relaxed mb-3">
									{urlDetails?.description}
								</div>
							</div>
						) : null}
						<div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 m-auto lg:w-full shadow-md py-4 md:px-8 px-2">
							<div className="p-4 relative shadow-md w-full md:col-span-1">
								<div className="title-font md:text-lg text-sm font-medium flex  justify-between items-center">
									<div className="flex justify-start items-center gap-2">
										<ExternalLinkIcon
											width={20}
											height={20}
											color="blue"
										/>
										<span className="text-blue-600">
											Original Url
										</span>
									</div>
									<div
										role="tooltip"
										title={copied1 ? "Copied" : "Copy Url"}
									>
										<CopyToClipboard
											text={urlDetails?.original_url}
											onCopy={() => setCopied1(true)}
										>
											<button onClick={handleCopy1}>
												<CopyIcon
													height={18}
													width={18}
													color={
														copied1
															? "gainsboro"
															: "gray"
													}
												/>
											</button>
										</CopyToClipboard>
									</div>
								</div>
								<a
									href={`${urlDetails?.original_url}`}
									target="blank"
									className="cursor-pointer underline break-words w-full overflow-y-scroll h-14 py-2 inline-block"
								>
									{urlDetails?.original_url}
								</a>
							</div>
							<div className="p-4 relative shadow-md w-full md:col-span-1">
								<div className="title-font md:text-lg text-sm font-medium flex  justify-between  items-center gap-2">
									<div className="flex justify-start items-center gap-2">
										<Link2Icon
											width={20}
											height={20}
											color="blue"
										/>
										<span className="text-blue-600">
											Short Url
										</span>
									</div>
									<div
										role="tooltip"
										title={copied2 ? "Copied" : "Copy Url"}
									>
										<CopyToClipboard
											text={`${urlDetails?.short_url}`}
											onCopy={() => setCopied2(true)}
										>
											<button onClick={handleCopy2}>
												<CopyIcon
													height={18}
													width={18}
													color={
														copied2
															? "gainsboro"
															: "gray"
													}
												/>
											</button>
										</CopyToClipboard>
									</div>
								</div>
								<a
									href={`${urlDetails?.short_url}`}
									className="cursor-pointer underline break-words"
									target="blank"
								>{`${urlDetails?.short_url}`}</a>
							</div>
							<div className="p-2 relative shadow-md w-full md:col-span-1 md:row-span-4 flex flex-col justify-center items-center bg-white gap-4 order-first md:order-none">
								<div
									className="mx-2 pb-4 shadow-md w-full flex flex-col justify-center items-center bg-white"
									ref={qrCodeRef}
								>
									<div className="bg-white p-8 rounded-lg shadow-md mb-3">
										<QRCode
											value={`${urlDetails?.short_url}`}
											size={256}
											style={{
												height: "auto",
												maxWidth: "100%",
												width: "100%",
											}}
										/>
									</div>
									<h1 className="text-2xl font-bold mb-2 text-blue-600">
										QR Code
									</h1>
									<p className="text-gray-600">
										Scan the QR code with your device
									</p>
								</div>
								<div role="tooltip" title="Download Qr">
									<button
										onClick={exportQRCode}
										className="flex justify-center items-center text-white
									bg-blue-500 px-2 py-1 rounded-md animate-bounce hover:animate-none"
									>
										<span>Download</span>
										<DownloadIcon height={18} width={18} />
									</button>
								</div>
							</div>
							<div className="p-4 relative shadow-md w-full md:col-span-1">
								<div className="title-font md:text-lg text-sm font-medium flex  justify-start  items-center gap-2">
									<CalendarIcon
										width={20}
										height={20}
										color="blue"
									/>
									<span className="text-blue-600">
										Expiration Date
									</span>
								</div>
								<p className="leading-relaxed">
									{urlDetails?.expiration_date?.split("T")[0]}
								</p>
							</div>
							<div className="p-4 relative shadow-md w-full md:col-span-1">
								<div className="title-font md:text-lg text-sm font-medium flex  justify-start  items-center gap-2">
									<StarIcon
										width={20}
										height={20}
										color="blue"
									/>
									<span className="text-blue-600">
										Short Id
									</span>
								</div>
								<p className="leading-relaxed">
									{urlDetails?.short_id}
								</p>
							</div>
							<div className="p-4 relative shadow-md w-full md:col-span-1">
								<div className="title-font md:text-lg text-sm font-medium flex  justify-start  items-center gap-2">
									<StackIcon
										width={20}
										height={20}
										color="blue"
									/>
									<span className="text-blue-600">
										Status
									</span>
								</div>
								<p className="leading-relaxed">
									{urlDetails?.status}
								</p>
							</div>
							<div className="p-4 relative shadow-md w-full md:col-span-1">
								<div className="title-font md:text-lg text-sm font-medium flex  justify-start  items-center gap-2">
									<EyeOpenIcon
										width={20}
										height={20}
										color="blue"
									/>
									<span className="text-blue-600">
										Total Visitors
									</span>
								</div>
								<p className="leading-relaxed">
									{urlDetails?.stats?.total_visitors}
								</p>
							</div>
							<div className="w-full md:col-span-2 flex justify-center items-center">
								<div className="p-4 relative shadow-md w-full lg:w-1/2 h-[100%]">
									<div className="title-font md:text-lg text-sm font-medium flex  justify-start  items-center gap-2">
										<PersonIcon
											width={20}
											height={20}
											color="blue"
										/>
										<span className="text-blue-600">
											Unique Visitors
										</span>
									</div>
									<p className="leading-relaxed">
										{urlDetails?.stats?.unique_visitors}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* Visitors Analytics */}
			<section className="text-gray-600 body-font rounded mb-4 mt-2 md:mt-0">
				<div className="container md:pb-3 mx-auto flex">
					<div className="flex flex-wrap mx-auto w-full shadow-2xl p-6 border-[2px] rounded border-blue-600">
						<div className="w-full mx-auto bg-white rounded-lg md:mt-4">
							<h1 className="title-font font-medium text-[1.6rem] mb-2 text-blue-600 capitalize">
								Visitors analytics:
							</h1>
							<div className="w-full overflow-x-scroll">
								<table className="bg-gray-200 w-full">
									<thead>
										<tr className="bg-white border-b">
											<th className="py-2 px-4 text-blue-500 font-medium capitalize whitespace-nowrap">
												Sl No
											</th>
											<th className="py-2 px-4 text-blue-500 font-medium capitalize whitespace-nowrap">
												IP Address
											</th>
											<th className="py-2 px-4 text-blue-500 font-medium capitalize whitespace-nowrap">
												Visit Date
											</th>
											<th className="py-2 px-4 text-blue-500 font-medium capitalize whitespace-nowrap">
												Visit Time
											</th>
											<th className="py-2 px-4 text-blue-500 font-medium capitalize whitespace-nowrap">
												Referrer
											</th>
										</tr>
									</thead>
									<tbody>
										{visitors.map((item, index) => (
											<tr
												key={index}
												className="even:bg-gray-100"
											>
												<td className="py-2 px-4 text-center whitespace-nowrap">
													{(page - 1) * 10 +
														index +
														1}
												</td>
												<td className="py-2 px-4 text-center whitespace-nowrap">
													{item?.ip_address}
												</td>
												<td className="py-2 px-4 text-center whitespace-nowrap">
													{
														item?.visit_time?.split(
															"T",
														)[0]
													}
												</td>
												<td className="py-2 px-4 text-center whitespace-nowrap">
													{
														item?.visit_time?.split(
															"T",
														)[1]
													}
												</td>
												<td className="py-2 px-4 text-center whitespace-nowrap">
													{item.referrer}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="m-auto mt-3 flex justify-end items-center">
								<button
									disabled={page == 1}
									className={twMerge(
										"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
										page == 1
											? "opacity-50 cursor-not-allowed"
											: "opacity-100 cursor-pointer",
									)}
									onClick={() => {
										setPage((pre) => pre - 1);
									}}
								>
									Prev
								</button>
								<button className="mx-6">{page}</button>
								<button
									className={twMerge(
										"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
										visitors.length < 6
											? "opacity-50 cursor-not-allowed"
											: "opacity-100 cursor-pointer",
									)}
									disabled={visitors.length < 6}
									onClick={() => {
										setPage((pre) => pre + 1);
									}}
								>
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Analytics;
