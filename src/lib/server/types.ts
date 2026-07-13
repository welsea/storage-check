export interface Item {
	id: string;
	item_id: string;
	name: string;
	last_updated: any;
	location_id: string;
	quantity: number;
	category_id: string;
}

export interface LocationItem {
	id: string;
	name: string;
	last_updated: string;
	last_updated_by: string;
	cover: string | null;
}

export interface EventLogItem {
	action: "DELETE" | "UPDATE" | "ADD" | "MOVE";
	target: string;
	item: Item;
}

export interface EventLogCategory {
	action: "DELETE" | "UPDATE" | "ADD" | "MOVE";
	target: string;
	item: CategoryItem;
}
export type CategoryItem = {
	id: number;
	location_id: number;
	name: string;
};
