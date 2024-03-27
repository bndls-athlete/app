// "use client";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Card from "../../../../components/Card";
// import {
//   faCheck,
//   faCloudArrowDown,
//   faCloudDownload,
//   faCloudDownloadAlt,
//   faEnvelope,
//   faLocationArrow,
// } from "@fortawesome/free-solid-svg-icons";
// import Visa from "../../../assets/img/visa-logo.webp";
// import Button from "../../../../components/Button";
// import Table from "@/app/components/Table";
// import { faBookmark, faStar } from "@fortawesome/free-regular-svg-icons";
// import { usePathname } from "next/navigation";
// import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
// import Link from "next/link";

// const Billing = () => {
//   const pathname = usePathname();
//   const type = getTypeFromPathname(pathname);

//   return (
//     <>
//       <div className="my-3">
//         <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
//           <Card className="px-0 pt-0 pb-0 flex flex-col justify-between">
//             <Card.Body className="my-0 py-6 px-6 my-auto">
//               <div className="flex justify-between gap-3">
//                 <div>
//                   <div className="flex gap-2 mb-2">
//                     <h6 className="font-semibold my-auto">Tier 3</h6>
//                     <div className="border-2 rounded-lg py-1 text-sm px-1 text-subtitle font-semibold">
//                       Monthly
//                     </div>
//                   </div>
//                   <span className="text-sm">
//                     Our most popular plan for small teams.
//                   </span>
//                 </div>
//                 <h1 className="my-auto text-4xl font-semibold">
//                   $10 <span className="text-subtitle text-sm">per month</span>
//                 </h1>
//               </div>
//             </Card.Body>
//             <Card.Footer className="px-6 py-3 border-t">
//               <div className="flex justify-end">
//                 <div className="flex gap-2 text-primary cursor-pointer hover:underline font-[600] my-auto">
//                   <Link href={`/${type}/plan/?menu=upgrade-options`}>
//                     Upgrade Plan
//                   </Link>
//                   <div className="mt-2">
//                     <svg
//                       width={10}
//                       height={10}
//                       viewBox="0 0 10 10"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M0.833252 9.16634L9.16659 0.833008M9.16659 0.833008H0.833252M9.16659 0.833008V9.16634"
//                         stroke="#C6B624"
//                         strokeWidth="1.66667"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </Card.Footer>
//           </Card>
//         </div>
//         <div className="my-3">
//           <div className="flex justify-between mb-4">
//             <div className="my-auto">
//               <h6 className="font-semibold text-lg">Billing and invoicing</h6>
//             </div>
//           </div>
//           <Table
//             headers={["Invoice", "Billing Date", "Status", "Amount", "Plan"]}
//             textShowing=""
//           >
//             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((row, index) => {
//               return (
//                 <tr key={index} className="whitespace-nowrap">
//                   <td className="p-3 text-sm">
//                     <div className="flex p-2 gap-2">
//                       <img
//                         className="w-10 h-10 my-auto"
//                         src="/svg/thumbnail_doc.svg"
//                         alt="Rounded avatar"
//                       />
//                       <div className="flex flex-col my-auto">
//                         <h6 className="font-semibold leading-2">
//                           Invoice #007 – Dec 2022
//                         </h6>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3 text-sm">
//                     <span>Dec 1, 2022</span>
//                   </td>
//                   <td className="p-3 text-sm">
//                     <div className="badge badge-success badge-outline p-4">
//                       <FontAwesomeIcon
//                         icon={faCheck}
//                         className="w-5 h-5 mr-2"
//                       />{" "}
//                       Paid
//                     </div>
//                   </td>
//                   <td className="p-3 text-sm">
//                     <span>USD $10.00</span>
//                   </td>
//                   <td className="p-3 text-sm">
//                     <div className="flex gap-2">
//                       <span>Tier 3</span>
//                     </div>
//                   </td>
//                   <td className="p-3 text-sm">
//                     <div className="text-primary font-semibold cursor-pointer hover:underline">
//                       Download
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </Table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Billing;
