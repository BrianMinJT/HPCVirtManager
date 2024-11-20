import React, { useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "../store/actions/userActions";
import { getNamespacesAction } from "../store/actions/projectActions";
import { getImageUrl } from "../utils/commonFunctions";
import { ReactComponent as Logo } from "../assets/images/svg/Logo.svg";
import { BreadCrumb } from "primereact/breadcrumb";
import { useBreadcrumb } from "../context/BreadcrumbContext";

export default function Topbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const { breadcrumbItems } = useBreadcrumb();

  useEffect(() => {
    dispatch(getProfileAction());
    dispatch(getNamespacesAction());
  }, [dispatch]);

  useEffect(() => {
    console.log('Topbar breadcrumbItems:', breadcrumbItems);
  }, [breadcrumbItems]);

  const { profile } = useSelector((state) => state.user);

  const editPage = () => {
    window.location.href = "/#/users/profile";
  };
   
  let username = profile?.firstName || "Loading...";
  let userimage = profile?.image;

  const getFirstCharacter = (name = "") => {
    let words = name.split(" ");
    let firstLetters = words.map((word) => word?.charAt(0).toUpperCase());
    firstLetters = firstLetters.slice(0, 2);
    return firstLetters;
  };

  const shouldShowBreadcrumbs = breadcrumbItems?.length > 0 && window.location.hash !== "#/dashboard";
  console.log('Should show breadcrumbs:', shouldShowBreadcrumbs, window.location.hash);
  
  return (
    <div className="layout-topbar px-4">
      <div className="flex align-items-center w-full">
        <div className="flex align-items-center">
          <div
            className="my-auto cursor-pointer mr-2 lg:hidden"
            onClick={toggleSidebar}
          >
            <i className="pi pi-bars text-2xl"></i>
          </div>
          <div className="lg:hidden">
            <Logo style={{ width: "180px" }} />
          </div>
        </div>

        <div className="flex-grow-1 mx-4" style={{ minHeight: '24px' }}>
          {shouldShowBreadcrumbs && (
            <BreadCrumb 
              model={breadcrumbItems} 
              className="border-none p-0"
              pt={{
                root: { className: 'bg-transparent border-none p-0' }
              }}
            />
          )}
        </div>

        <div className="top-menu" onClick={editPage}>
          <div className="flex align-items-center">
            {userimage ? (
              <Avatar
                image={getImageUrl(userimage)}
                shape="circle"
                className="my-auto"
              />
            ) : (
              <Avatar
                style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                label={getFirstCharacter(profile?.firstName)}
                size="small"
                shape="circle"
                className="my-auto"
              />
            )}
            <div className="flex ml-2 my-auto">
              <span className="username">{username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
