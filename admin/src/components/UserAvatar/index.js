import React from "react";

const UserAvatar = () => {
    return (
        <div className="userImg">
                      <span className="rounded-circle">
                        <img
                            src="/i_passport.jpg"
                            className="rounded-circle"
                            alt="User"
                        />
                      </span>
        </div>
    );
}

export default UserAvatar;