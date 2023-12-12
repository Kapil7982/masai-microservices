export interface UrlItem {
	short_id: string;
	title: string;
	status: string;
	description: string;
	expiration_date: string;
	short_url: string;
}
export interface UrlRowProps {
	index: number;
	page: number;
	item: UrlItem;
	openEditModal: (item: UrlItem) => void;
	handleRemove: (item: UrlItem) => void;
}
export interface UrlCardProps {
	index: number;
	item: UrlItem;
	openEditModal: (item: UrlItem) => void;
	handleRemove: (item: UrlItem) => void;
}
export interface EditModalProps {
	isOpen: boolean;
	onClose: () => void;
	data: {
		title: string;
		description: string;
		expiration_date: string;
		short_id: string;
	};
	handleEdit: (id: string, formData: Record<string, string>) => void;
}
export interface HomeFormData {
	originalUrl: string;
	title: string;
	description: string;
	expiring: string;
}
export interface UrlDetails {
	_id: string;
	original_url: string;
	short_id: string;
	expiration_date: string;
	starting_date: string;
	title: string;
	description: string;
	status: string;
	stats: {
		total_visitors: number;
		unique_visitors: number;
	};
}
export interface GetUrlDetailsAxiosResponse {
	url_details: UrlDetails;
}
export interface VisitorData {
	_id: string;
	ip_address: string;
	visit_time: string;
}
