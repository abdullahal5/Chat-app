import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/slice/authSlice";
import { useGetAllUserQuery } from "../../redux/features/callApis/userApi";

const Home = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllUserQuery();
  console.log(data);
  const name = data?.data[0]?.name;
  return (
    <div className="bg-[url('https://i.ibb.co/PDnqjfy/background.png')] w-full bg-no-repeat bg-cover bg-fixed">
      <button
        onClick={() => dispatch(logout())}
        className="text-white rounded-md bg-rose-500 px-3 py-1"
      >
        Logout
      </button>
      {isLoading ? "loading" : name}

    </div>
  );
};

export default Home;
