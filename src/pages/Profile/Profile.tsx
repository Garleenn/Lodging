import './Profile.scss'
import { Header } from '../../components/Header/Header';
import { UserProfile } from '../../components/Profile/UserProfile';
import { ProductsProfile } from '../../components/Profile/ProductsProfile';

export function Profile() {


	return (
		<>
			<Header />
			<UserProfile />
			<ProductsProfile />
		</>
	)
}