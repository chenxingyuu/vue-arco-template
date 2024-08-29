import axios from 'axios';
import { PaginatedResponse } from '@/types/global';
import { Menu, MenuQueryParams, MenuTree } from '@/api/system/types';

export async function getMenuList(params: MenuQueryParams) {
  return axios.get<PaginatedResponse<Menu>>('/menus', { params });
}

export async function getMenuListAllTree(params: MenuQueryParams) {
  return axios.get<MenuTree[]>('/menus/all/tree', {
    params,
  });
}

export async function getMenuDetail() {
  return axios.get<Menu>('/menus');
}

export async function createMenu(menu: Pick<Menu, 'name' | 'description'>) {
  return axios.post('/menus', menu);
}

export async function updateMenu(
  id: number,
  menu: Pick<Menu, 'name' | 'description'>
) {
  return axios.put(`/menus/${id}`, menu);
}

export async function partialUpdateMenu(id: number, menu: Partial<Menu>) {
  return axios.patch(`/menus/${id}`, menu);
}

export async function deleteMenu(id: number) {
  return axios.delete(`/menus/${id}`);
}

export async function getAllMenu() {
  return axios.get<Menu[]>('/menus/all');
}
