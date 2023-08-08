import Login from "./Login"
import { useAppSelector } from '../../app/hooks';
import AddPost from "./AddPost";

const DashBoard = () => {
    const usuario = useAppSelector((state) => state.user);


    if (usuario)
        console.log(usuario.token)
    return (
        <main>
            {!usuario.user && <Login />}
            {usuario.user && <AddPost />}

        </main>
    )
}

export default DashBoard