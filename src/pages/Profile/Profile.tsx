import { useParams } from 'react-router-dom'
import './Profile.scss'
import { Header } from '../../components/Header/Header';
import { UserProfile } from '../../components/Profile/Profile';

export function Profile() {
	const { id } = useParams();
	

	return (
		<>
			<Header />
			<UserProfile />
		</>
	)
}