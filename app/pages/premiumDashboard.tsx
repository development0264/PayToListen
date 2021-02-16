import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
    {
        columns: [
            {
                Header: () => (
                    <div style={{ backgroundColor: "#FFF", width: "100%" }}>
                        <span >
                            <i /> ArtistName
              </span></div>
                ),
                accessor: 'artistName',

            },
            {
                Header: "Member Since",
                id: "memberSince",
                accessor: (d: any) => d.memberSince
            },
            {
                Header: "Pay Period",
                accessor: "payPeriod"
            },
            {
                Header: "Amount Accrued",
                accessor: "amountAccrued"
            },
            {
                Header: "Total Revenue Paid (YTD)",
                accessor: "totalRevenuePeriod"
            },
        ]
    }
];

const level1Column = [
    {
        columns: [
            {
                Header: "Revenue Type",
                accessor: "revenueType"
            },
            {
                Header: "Amount",
                id: "revenue",
                accessor: (d: any) => d.revenue
            },
        ]
    }
];

const level2Column = [
    {
        columns: [
            {
                Header: "Month",
                accessor: "month"
            },
            {
                Header: "Revenue",
                id: "rate",
                accessor: (d: any) => d.rate
            },
        ]
    }
];

const level3Column = [
    {
        columns: [
            {
                Header: "Region",
                accessor: "region"
            },
            {
                Header: "Rate",
                id: "rate",
                accessor: (d: any) => d.rate
            },
            {
                Header: "Count",
                accessor: "count"
            },
            {
                Header: "Revenue",
                accessor: "revenue"
            }
        ]
    }
];

const level3SubColumn = [
    {
        columns: [
            {
                Header: "Region",
                accessor: "region"
            },
            {
                Header: "Rate",
                id: "rate",
                accessor: (d: any) => d.rate
            },
            {
                Header: "Number of Streams",
                accessor: "noOfStreams"
            },
            {
                Header: "Revenue",
                accessor: "revenue"
            }
        ]
    }
];

const level4Column = [
    {
        columns: [
            {
                Header: "Album Name",
                id: "albumName",
                accessor: (d: any) => d.albumName
            },
            {
                Header: "Purchase Date",
                accessor: "purchaseDate"
            },
            {
                Header: "Location",
                accessor: "location"
            }
        ]
    }
];
const level4SubColumn = [
    {
        columns: [
            {
                Header: "Content Name",
                accessor: "contentName"
            },
            {
                Header: "Album Name",
                id: "albumName",
                accessor: (d: any) => d.albumName
            },
            {
                Header: "Stream Date",
                accessor: "streamDate"
            },
            {
                Header: "Stream Time",
                accessor: "streamTime"
            },
            {
                Header: "Location",
                accessor: "location"
            }
        ]
    }
];

const premiumDashboard = () => {

    const albumData = [
        {
            artistName: "Sai Vignesh",
            memberSince: "1/1/2021",
            payPeriod: "4/1/2021 to 6/30/2021",
            amountAccrued: "₹125.00",
            totalRevenuePeriod: "₹625.00",
            children: [
                {
                    revenueType: 'Premium Content',
                    revenue: "₹100.00",

                    children: [
                        {
                            month: "April",
                            revenue: "₹25",
                            children: [
                                {
                                    region: "US",
                                    rate: "0.56",
                                    count: "3",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "India",
                                    rate: "0.20",
                                    count: "75",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "Europe",
                                    rate: "0.60",
                                    count: "11",
                                    revenue: "₹6.60",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            month: "May",
                            revenue: "₹25",
                            children: [
                                {
                                    region: "US",
                                    rate: "0.56",
                                    count: "3",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "India",
                                    rate: "0.20",
                                    count: "75",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "Europe",
                                    rate: "0.60",
                                    count: "11",
                                    revenue: "₹6.60",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            month: "June",
                            revenue: "₹50",
                            children: [
                                {
                                    region: "US",
                                    rate: "0.56",
                                    count: "3",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "India",
                                    rate: "0.20",
                                    count: "75",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "Europe",
                                    rate: "0.60",
                                    count: "11",
                                    revenue: "₹6.60",
                                    children: [
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "4/2/2021",
                                            location: "London"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "5/6/2021",
                                            location: "Cambridge"
                                        },
                                        {
                                            albumName: "Shivoham",
                                            purchaseDate: "6/6/2021",
                                            location: "Lisbon"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    revenueType: 'Streaming Content',
                    revenue: "₹25.00",
                    children: [
                        {
                            month: "January",
                            revenue: "₹10.00",
                            children: [
                                {
                                    region: "US",
                                    rate: "₹0.56",
                                    noOfStreams: "9",
                                    revenue: "₹5.04",
                                    children: [
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "London"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/6/2021",
                                            streamTime: "11:15 AM",
                                            location: "Cambridge"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "5/6/2021",
                                            streamTime: "11:15 AM",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "India",
                                    rate: "₹0.20",
                                    noOfStreams: "75",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        }
                                    ]
                                },
                                {
                                    region: "Europe",
                                    rate: "₹0.60",
                                    noOfStreams: "11",
                                    revenue: "₹6.60",
                                    children: [
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            month: "February",
                            revenue: "₹125",
                            status: "Paid",
                            statusDate: "5/2/2021",
                            children: [
                                {
                                    region: "US",
                                    rate: "₹0.56",
                                    noOfStreams: "9",
                                    revenue: "₹5.04",
                                    children: [
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "London"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/6/2021",
                                            streamTime: "11:15 AM",
                                            location: "Cambridge"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "5/6/2021",
                                            streamTime: "11:15 AM",
                                            location: "Lisbon"
                                        }
                                    ]
                                },
                                {
                                    region: "India",
                                    rate: "₹0.20",
                                    noOfStreams: "75",
                                    revenue: "₹15.00",
                                    children: [
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        }
                                    ]
                                },
                                {
                                    region: "Europe",
                                    rate: "₹0.60",
                                    noOfStreams: "11",
                                    revenue: "₹6.60",
                                    children: [
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        },
                                        {
                                            contentName: "Mohana Rama",
                                            albumName: "Shivoham",
                                            streamDate: "1/2/2021",
                                            streamTime: "11:15 AM",
                                            location: "Chennai"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    console.log("Data", albumData);
    return (
        <div style={{ backgroundColor: "#000", margin: 2, padding: 10 }}>
            <h1 style={{ color: "#FFF" }}>Eppo Music Billing Dashboard </h1>
            <div style={{ backgroundColor: "#FFF", opacity: "initial" }}>
                <ReactTable
                    data={albumData}
                    columns={columns}
                    defaultPageSize={15}
                    className="-striped -highlight"
                    getTrProps={() => {
                        return {
                            style: {
                                backgroundColor: "grey",
                                textAlign: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#000"
                            }
                        }
                    }}
                    SubComponent={(row: any) => {
                        return (
                            <div style={{ padding: "20px" }}>
                                <ReactTable
                                    data={albumData[0].children}
                                    columns={level1Column}
                                    defaultPageSize={3}
                                    showPagination={false}
                                    getTrProps={() => {
                                        return {
                                            style: {
                                                textAlign: "center",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }
                                        }
                                    }}
                                    SubComponent={(row: any) => {
                                        console.log("row", row);
                                        return (
                                            <div style={{ padding: "20px" }}>
                                                <ReactTable
                                                    data={row.index == 0 ? albumData[0].children[0].children : albumData[0].children[1].children}
                                                    columns={level2Column}
                                                    defaultPageSize={3}
                                                    showPagination={false}
                                                    getTrProps={() => {
                                                        return {
                                                            style: {
                                                                textAlign: "center",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }
                                                        }
                                                    }}
                                                    SubComponent={(rowLevel3: any) => {
                                                        console.log("rowLevel3", rowLevel3);
                                                        return (
                                                            <div style={{ padding: "20px" }}>
                                                                <ReactTable
                                                                    data={row.index == 0 ?
                                                                        albumData[0].children[0].children[0]
                                                                            .children : albumData[0].children[1].children[0]
                                                                            .children
                                                                    }
                                                                    columns={row.index == 0 ? level3Column : level3SubColumn}
                                                                    defaultPageSize={3}
                                                                    showPagination={false}
                                                                    getTrProps={() => {
                                                                        return {
                                                                            style: {
                                                                                textAlign: "center",
                                                                                alignItems: "center",
                                                                                justifyContent: "center"
                                                                            }
                                                                        }
                                                                    }}
                                                                    SubComponent={(rowLevel4: any) => {
                                                                        console.log("rowLevel4", rowLevel4);
                                                                        return (
                                                                            <div style={{ padding: "20px" }}>
                                                                                <ReactTable
                                                                                    data={row.index == 0 ?
                                                                                        albumData[0].children[0].children[0]
                                                                                            .children[0].children : albumData[0].children[1].children[0]
                                                                                                .children[0].children
                                                                                    }
                                                                                    columns={row.index == 0 ? level4Column : level4SubColumn}
                                                                                    defaultPageSize={3}
                                                                                    showPagination={false}
                                                                                    getTrProps={() => {
                                                                                        return {
                                                                                            style: {
                                                                                                textAlign: "center",
                                                                                                alignItems: "center",
                                                                                                justifyContent: "center"
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        );
                    }}
                />
                <br />
            </div>
        </div>
    );
}

export default premiumDashboard;
