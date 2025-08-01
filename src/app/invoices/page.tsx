// src/app/admin/users/page.tsx
"use client";

import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { useUserStore } from '@/store/user-store';
import { useDebounce } from 'use-debounce';

export default function UserManagementPage() {
  // Get everything from the Zustand store
  const {
    users,
    pagination,
    isLoading,
    error,
    filters,
    fetchUsers,
    setFilters,
    setPage
  } = useUserStore();

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  
  // Local state for input fields to allow for debouncing
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce by 500ms

  // Fetch initial data on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Effect to apply debounced search term to the store's filter
  useEffect(() => {
    setFilters({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm, setFilters]);

  const handleKycFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ kycStatus: e.target.value });
  };
  
  const toggleOrders = (userId: string) => {
    setExpandedUserId(prevId => (prevId === userId ? null : userId));
  };
  
  // Memoize the table body to prevent re-renders on input change
  const userTableRows = useMemo(() => (
    users.map(user => (
      <Fragment key={user._id}>
        <tr
          onClick={() => user.orderCount > 0 && toggleOrders(user._id)}
          className={user.orderCount > 0 ? "cursor-pointer hover:bg-gray-50" : ""}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.email.address}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{user.kyc.status}</span></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.orderCount}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
        </tr>
        {expandedUserId === user._id && (
          <tr>
            <td colSpan={5} className="p-4 bg-gray-100">
              <h4 className="font-bold text-md mb-2">Order Details</h4>
              {user.orders.length > 0 ? (
                <ul className="space-y-2">
                  {user.orders.map(order => (
                    <li key={order._id} className="p-2 border rounded-md bg-white text-sm">
                      <strong>ID:</strong> {order.confirmationId} | <strong>Status:</strong> {order.status} | <strong>Amount:</strong> {(order.amount / 100).toFixed(2)} {order.currency}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500">No orders found for this user.</p>}
            </td>
          </tr>
        )}
      </Fragment>
    ))
  ), [users, expandedUserId]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User & Order Management</h1>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.kycStatus}
          onChange={handleKycFilterChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All KYC Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Data Display */}
      {isLoading && <div className="text-center p-4">Loading users...</div>}
      {error && <div className="text-center p-4 text-red-500">Error: {error}</div>}
      
      {!isLoading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userTableRows}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total users)</span>
            <div>
              <button
                onClick={() => setPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1 || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-l-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-r-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}