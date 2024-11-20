import { Outlet, Navigate} from "react-router-dom";
import {useSelector} from 'react-redux';

const PrivateRoute = () =>{
  const user = useSelector((state) => state.user);

  if(!user.isLoggedIn) {
    alert("잘못된 접근입니다.");
  }
  console.log(user);
  return user.isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;