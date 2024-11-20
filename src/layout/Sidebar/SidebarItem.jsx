import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import classNames from "classnames";

export default function SidebarItem(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const _title = props.title;
  const _items = props.items;
  const _onClick = props.onClick;
  const _link = props.link;
  const _icon = props.icon;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const onItemClick = () => {
    if (_items && _items.length) {
      handleToggle();
      return;
    }
    if (_link) {
      navigate(_link);
      return;
    }

    if (_onClick) {
      _onClick();
      return;
    }
  };

  const getActive = (path) => {
    return path === location.pathname;
  };
  return (
    <>
      <div
        className={classNames("sidebar-item flex justify-content-between align-items-center", {
          active: isOpen || getActive(_link),
        })}
        onClick={onItemClick}
      >
        <div className="flex align-items-center">
          {_icon && <i className={`text-lg mr-2 ${_icon}`}></i>}
          <span>{_title}</span>
        </div>
        {_items && _items.length && (
          <i
            className={classNames("open-icon pi pi-angle-right my-auto", {
              open: isOpen,
            })}
          ></i>
        )}
      </div>

      {isOpen && (
        <div className="menu-items">
          {_items.map((item, i) => (
            <MenuItem
              key={i}
              Svg={item?.icon}
              title={item?.title}
              items={item?.items}
              link={item?.link ? _link + item?.link : _link}
            />
          ))}
        </div>
      )}
    </>
  );
}
