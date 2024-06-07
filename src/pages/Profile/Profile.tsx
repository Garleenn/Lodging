import { useParams } from 'react-router-dom'
import './Profile.scss'
import { Header } from '../../components/Header/Header';
import { UserProfile } from '../../components/UserProfile/UserProfile';
import { ProductsProfile } from '../../components/ProductsProfile/ProductsProfile';

export function Profile() {
	const { id } = useParams();


	return (
		<>
			<Header />
			<UserProfile />
			<ProductsProfile />
		</>
	)
}