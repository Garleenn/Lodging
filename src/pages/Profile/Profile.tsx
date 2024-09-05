import './Profile.scss'
import { UserProfile } from '../../components/Profile/UserProfile';
import { ProductsProfile } from '../../components/Profile/ProductsProfile';
import { Footer } from '../../components/Footer/Footer';

export function Profile() {


	return (
		<>
		<div className={"size"}>
			<UserProfile />
			<ProductsProfile />
		</div>
			<Footer />
		</>
	)
}