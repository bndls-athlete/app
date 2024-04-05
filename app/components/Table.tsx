"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface TableProps {
  children: React.ReactNode;
  headers: string[];
  textShowing: string;
  subtitle?: string;
  withPagination?: boolean;
}

const Table: React.FC<TableProps> = ({
  children,
  headers = [],
  textShowing = "",
  subtitle = "",
  withPagination = false,
}) => {
  return (
    <div className="my-4">
      <h6 className="text-lg font-semibold mb-3 capitalize">{textShowing}</h6>
      <div className="mb-2">
        <span>{subtitle}</span>
        <div className="my-3 border rounded-xl pb-3 overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="whitespace-nowrap">
                {headers.map((row, index) => (
                  <th key={index} className="p-3 text-sm">
                    {row}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border-t">{children}</tbody>
          </table>
        </div>
        {withPagination && (
          <div className="flex justify-between px-4 pt-3 border-t">
            <div className="flex gap-3">
              <button className="btn btn-ghost btn-sm">Previous</button>
              <button className="btn btn-ghost btn-sm">Next</button>
            </div>
            <h6 className="my-auto font-semibold text-sm">Page 1 of 1</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
