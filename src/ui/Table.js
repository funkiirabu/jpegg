import React from 'react';

const Table = ({ data, columns }) => {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <table className="w-full text-left">
              <thead className="bg-white">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ${
                        column.hideOnMobile ? 'hidden sm:table-cell' : ''
                      }`}
                    >
                      {column.header}
                      <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                      <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    {columns.map((column) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className={`relative py-4 pr-3 text-sm font-medium text-gray-900 ${
                          column.hideOnMobile ? 'hidden sm:table-cell' : ''
                        }`}
                      >
                        {row[column.key]}
                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
