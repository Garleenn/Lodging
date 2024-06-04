import { useParams } from "react-router-dom"


export function UserProfile() {

	const { id } = useParams<string>();


	return (
		<>
			<div className="flex flex-col items-center gap-12 my-10 mx-40">
				<div className="profile-info flex">
					{/* <img src={data.image} alt={data.login} /> */}
				</div>
			</div>
		</>
	)
}