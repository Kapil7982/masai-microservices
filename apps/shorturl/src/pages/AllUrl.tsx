// Library import
import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { Link } from "react-router-dom";
// Component import
import EditModal from "../components/EditModal.tsx";
import StickyButton from "../components/StickyButton.tsx";
import { UrlRow } from "../components/UrlRow.tsx";
// Env import
const server = import.meta.env.VITE_SERVER;
// Types
import { UrlItem } from "../types/Types.tsx";
import { UrlCard } from "../components/UrlCard.tsx";

const AllUrl: React.FC = () => {
	const [page, setPage] = useState<number>(1);
	const [allUrl, setAllUrl] = useState<UrlItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [editModalData, setEditModalData] = useState<UrlItem>({} as UrlItem);

	const openEditModal = (item: UrlItem) => {
		setIsEditModalOpen(true);
		setEditModalData(item);
	};

	const handleRemove = async (item: UrlItem) => {
		try {
			await axios.delete(`${server}/delete/${item.short_id}`);
			getAllUrl();
		} catch (error) {
			console.log(error);
		}
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
	};

	const handleEdit = async (id: string, formData: Record<string, string>) => {
		try {
			await axios.put(`${server}/update/${id}`, formData);
			getAllUrl();
			closeEditModal();
		} catch (error) {
			console.log(error);
			alert("Could not be update expired url");
		}
	};

	const getAllUrl = async () => {
		setLoading(!loading);
		try {
			const res = await axios.get(`${server}/appid?page=${page}`);
			if (res.data) {
				setAllUrl(res.data);
			}
		} catch (err) {
			console.log(err);
		}
		setLoading(!loading);
	};

	useEffect(() => {
		getAllUrl();
	}, [page]);
	return (
		<>
			<div className="lg:container mx-auto md:p-8 md:pb-2 lg:pt-4 p-2">
				<div className="w-full flex justify-end items-center mb-2">
					<Link to={"/"}>
						<StickyButton onClick={() => {}} label={"Go back"} />
					</Link>
				</div>
				<section className="text-gray-600 body-font rounded mb-4 ">
					<div className="container md:pb-3 mx-auto flex">
						<div className="flex flex-wrap mx-auto w-full shadow-2xl p-2 md:p-6 md:pt-0 md:pb-3 border-[2px] rounded border-blue-600">
							<div className="w-full mx-auto bg-white rounded-lg md:mt-4 px-5">
								<h1 className="text-center md:text-start title-font font-medium text-[1.6rem] mb-2 md:text-blue-600 capitalize">
									Generated Links:
								</h1>
								<div className="w-full overflow-x-scroll">
									<table className="min-w-full bg-gray-100 text-center hidden md:table mt-2">
										<thead>
											<tr>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap">
													Sl No.
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap text-start">
													Title
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap text-start">
													Short Url
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap">
													Copy
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap text-center">
													Status
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap">
													Details
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap">
													Edit
												</th>
												<th className="py-1 px-4 text-blue-500 font-medium text-lg capitalize whitespace-nowrap">
													Delete
												</th>
											</tr>
										</thead>
										<tbody>
											{allUrl.length ? (
												allUrl.map((item, index) => (
													<UrlRow
														key={index}
														index={index}
														page={page}
														item={item}
														openEditModal={
															openEditModal
														}
														handleRemove={
															handleRemove
														}
													/>
												))
											) : (
												<tr className="text-center md:text-start title-font font-medium text-[1.6rem] mb-2 capitalize">
													<td>no items found</td>
												</tr>
											)}
										</tbody>
									</table>
									{/* For small screen: Start */}
									<div className="w-full md:hidden">
										{allUrl.map((item, index) => (
											<UrlCard key={index} item={item} index={index} openEditModal={openEditModal} handleRemove={handleRemove}/>
										))}
									</div>
								</div>
								{/* For small screen end */}
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
											allUrl.length < 10
												? "opacity-50 cursor-not-allowed"
												: "opacity-100 cursor-pointer",
										)}
										disabled={allUrl.length < 10}
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
			<EditModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				data={editModalData}
				handleEdit={handleEdit}
			/>
		</>
	);
};

export default AllUrl;
