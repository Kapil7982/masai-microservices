import React, { useEffect, useState, ChangeEvent } from "react";

interface EditModalProps {
	isOpen: boolean;
	onClose: () => void;
	data: {
		title: string;
		description: string;
		expiration_date: string;
		short_id: string;
    status:string;
	};
	handleEdit: (id: string, formData: Record<string, string>) => void;
}

const EditModal: React.FC<EditModalProps> = ({
	isOpen,
	onClose,
	data,
	handleEdit,
}) => {
	const [formData, setFormData] = useState({
		title: data.title,
		description: data.description,
		expiration_date: data.expiration_date,
    status:data.status
	});
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>,
	) => {
		const { name: key, value } = e.target;
		const expireTimestamp =
			key == "expiration_date" ? new Date(value).getTime() : null;
		const startTimestamp = new Date().getTime();
		if (
			expireTimestamp &&
			expireTimestamp - startTimestamp < 24 * 60 * 60 * 1000
		) {
			setErrorMessage(
				"The difference between starting and expiring dates must be at least 24 hours",
			);
			// Clear error message after 2 seconds
			setTimeout(() => {
				setErrorMessage("");
			}, 4000);

			return;
		}
		setFormData({
			...formData,
			[key]: value,
		});
	};

	useEffect(() => {
		setFormData(data);
	}, [data]);

	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 overflow-y-auto border border-solid border-black">
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 transition-opacity"
							aria-hidden="true"
						>
							<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>

						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>

						<div
							className="border-[2px] border-blue-600 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
							role="dialog"
							aria-modal="true"
							aria-labelledby="modal-headline"
						>
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="w-full">
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Update details
										</h3>
										<div className="mt-2 grid grid-cols-2 gap-2">
											<div className="flex flex-col col-span-2">
												<label
													className="text-left"
													htmlFor="title"
												>
													Title:
												</label>
												<input
													className="p-1 bg-gray-100 rounded-md focus:outline-gray-300 text-md text-gray-800"
													name="title"
													type="text"
													placeholder="Title"
													onChange={handleChange}
													value={formData.title}
												/>
											</div>
											<div className="flex flex-col col-span-2 md:col-span-1">
												<label
													className="text-left"
													htmlFor="expire"
												>
													Expire Date:
												</label>
												<input
													className="p-1 bg-gray-100 rounded-md focus:outline-gray-300 text-md text-gray-800"
													type="date"
													name="expiration_date"
													onChange={handleChange}
													value={
														formData.expiration_date?.split('T')[0]
													}
												/>
											</div>
											<div className="flex flex-col col-span-2 md:col-span-1">
												<label
													className="text-left"
													htmlFor="title"
												>
													Status:
												</label>
												<select
                          value={formData.status}
                          name="status"
                          onChange={handleChange}
                         className="p-1 bg-gray-100 rounded-md focus:outline-gray-300 text-md text-gray-800"
                         >
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="draft">Draft</option>
                        </select>
											</div>
											<div className="flex flex-col col-span-2">
												<label
													className="text-left"
													htmlFor="description"
												>
													Description:
												</label>
												<textarea
													className="p-1 bg-gray-100 rounded-md focus:outline-gray-300 text-md text-gray-800"
													placeholder="Description"
													name="description"
													onChange={handleChange}
													value={formData.description}
													rows={3}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							{errorMessage && (
								<p className="text-red-500 text-md mb-2">
									{errorMessage}
								</p>
							)}
							<div className="bg-gray-50 px-4 py-1 flex justify-end">
								<button
									onClick={() =>
										handleEdit(data.short_id, formData)
									}
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 sm:ml-3 sm:w-auto sm:text-md"
								>
									Update
								</button>
								<button
									onClick={onClose}
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200 sm:ml-3 sm:w-auto sm:text-md"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EditModal;
