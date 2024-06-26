import './Profile.scss'
import { UserProfile } from '../../components/Profile/UserProfile';
import { ProductsProfile } from '../../components/Profile/ProductsProfile';

export function Profile() {


	return (
		<>
			<UserProfile />
			<ProductsProfile />
		</>
	)
}