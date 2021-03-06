import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from '@reach/router';

import Layout from '../components/layout';
import Modal from '../components/Modal';
import LessonItem from '../components/LessonItem';
import CreateLesson from '../components/Create/CreateLesson';
import ModalContent from '../components/ModalContent';
import { pageName } from '../utils';
import { GET_MODULE } from '../gql/index';
import { dash_container, dash_items } from '../styles/index';
import MarkDown from './../components/MarkDown';

const LessonDash = ({ sprint, track, module }) => {
	const [showModal, setModal] = useState(false);
	const { loading, error, data, refetch } = useQuery(GET_MODULE, {
		variables: { where: { name: pageName(module) } }
	});
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;
	return (
		<Layout>
			<div css={dash_container}>
				<div className="dash-header">
					<div>
						<Link to="/dashboard">{track}</Link> >{' '}
						<Link to={`/dashboard/${track}`}>{sprint}</Link> >{' '}
						<Link to={`/dashboard/${track}/${sprint}`}>{module}</Link>
					</div>
					<h2>{pageName(module)}</h2>

					<MarkDown content={data.module.description} />
					<button className="btn primary" onClick={() => setModal(!showModal)}>
						Create Lesson
					</button>
				</div>
				{showModal ? (
					<Modal>
						<ModalContent
							header="New Lesson"
							setModal={setModal}
							component={
								<CreateLesson
									setModal={setModal}
									module={pageName(module)}
									refetch={refetch}
								/>
							}
						/>
					</Modal>
				) : null}
				<div css={dash_items}>
					{data.module.lessons.map(lesson => (
						<LessonItem
							key={lesson.id}
							sprint={sprint}
							track={track}
							module={module}
							lesson={lesson}
							refetch={refetch}
						/>
					))}
				</div>
			</div>
		</Layout>
	);
};

export default LessonDash;
