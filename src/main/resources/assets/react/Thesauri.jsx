import getIn from 'get-value';
import {Button, Header, Icon, Loader, Popup, Table} from 'semantic-ui-react';

import {EditSynonymsModal} from './thesaurus/EditSynonymsModal';
//import {NewOrEditSynonym} from './thesaurus/NewOrEditSynonym';
import {NewOrEditThesaurus} from './thesaurus/NewOrEditThesaurus';
import {DeleteThesaurus} from './thesaurus/DeleteThesaurus';
import {Import} from './thesaurus/Import';


export function ThesauriList(props) {
	//console.debug('Thesauri props', props);
	const {
		licenseValid,
		servicesBaseUrl,
		setLicensedTo,
		setLicenseValid
	} = props;
	//console.debug('ThesauriList licenseValid', licenseValid);

	const [isLoading, setLoading] = React.useState(false);
	const [thesauriRes, setThesauriRes] = React.useState({
		count: 0,
		hits: [],
		total: 0
	});
	const [synonymsSum, setSynonymsSum] = React.useState(0);
	const [queryFieldsGraph, setQueryFieldsGraph] = React.useState({
		count: 0,
		hits: [],
		total: 0
	});
	//console.debug('ThesauriList queryFieldsGraph', queryFieldsGraph);
	const languageValues = getIn(queryFieldsGraph, ['hits', 0, 'values'], []);
	//console.debug('languageValues', languageValues);
	const languagesOptions = [{
		key: '_none',
		text: 'When no language is selected',
		value: '_none'
	},{
		key: '_any',
		text: 'Any language selected',
		value: '_any'
	}].concat(languageValues.map(({
		_name: key,
		displayName:text
	}) => ({
		key,
		text,
		value: key
	})));
	//console.debug('languagesOptions', languagesOptions);

	function fetchThesauri() {
		setLoading(true);
		fetch(`${servicesBaseUrl}/thesaurusList`)
			.then(response => response.json())
			.then(data => {
				//console.debug('fetchThesauri data', data);
				let sum = data.total ? data.hits
					.map(({synonymsCount}) => synonymsCount)
					.reduce((accumulator, currentValue) => accumulator + currentValue) : 0;
				setThesauriRes(data);
				setSynonymsSum(sum);
				setLoading(false);
			});
		fetch(`${servicesBaseUrl}/graphQL`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: `{
	queryFields(fields: ["language"]) {
		total
		count
		hits {
			_name
			key
			values {
				_name
				displayName
				value
			}
		}
	}
}`})
		})
			.then(res => res.json())
			.then(res => {
				//console.log(res);
				if (res && res.data) {
					setQueryFieldsGraph(res.data.queryFields);
				}
			});
	} // fetchThesauri

	React.useEffect(() => fetchThesauri(), []);

	return <>
		{isLoading
			? <Loader active inverted>Loading</Loader>
			: <Table celled compact selectable sortable striped attached='top'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Display name</Table.HeaderCell>
						<Table.HeaderCell>Languages</Table.HeaderCell>
						<Table.HeaderCell>Synonyms</Table.HeaderCell>
						<Table.HeaderCell>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{thesauriRes.hits.map(({
						//description,
						displayName,
						id,
						languages,// = ['_none', '_any'],
						name,
						synonymsCount
					}, index) => {
						return <Table.Row key={index}>
							<Table.Cell>{displayName}</Table.Cell>
							<Table.Cell>{languages.join(', ')}</Table.Cell>
							<Table.Cell>{synonymsCount}</Table.Cell>
							<Table.Cell>
								<Button.Group>
									{/*<NewOrEditSynonym
										onClose={fetchThesauri}
										servicesBaseUrl={servicesBaseUrl}
										thesaurusId={id}
									/>*/}
									{/*<EditSynonymsModal
										onClose={fetchThesauri}
										servicesBaseUrl={servicesBaseUrl}
										thesaurusId={id}
										thesaurusName={name}
									/>*/}
									<NewOrEditThesaurus
										displayName={displayName}
										id={id}
										languages={languages}
										languagesOptions={languagesOptions}
										licenseValid={licenseValid}
										name={name}
										onClose={fetchThesauri}
										servicesBaseUrl={servicesBaseUrl}
									/>
									<DeleteThesaurus
										id={id}
										name={name}
										onClose={fetchThesauri}
										servicesBaseUrl={servicesBaseUrl}
									/>
									<Import
										name={name}
										onClose={fetchThesauri}
										servicesBaseUrl={servicesBaseUrl}
									/>
									<Popup
										content={`Export from thesaurus ${name}`}
										inverted
										trigger={<Button
											as='a'
											icon
											href={`${servicesBaseUrl}/thesaurusExport?name=${name}`}
										><Icon color='blue' name='download'/></Button>}
									/>
								</Button.Group>
							</Table.Cell>
						</Table.Row>;
					})}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.HeaderCell></Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell>
						<Table.HeaderCell>{synonymsSum}</Table.HeaderCell>
						<Table.HeaderCell>
							<EditSynonymsModal
								onClose={fetchThesauri}
								servicesBaseUrl={servicesBaseUrl}
							/>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>}
		<NewOrEditThesaurus
			languages={['_none', '_any']}
			languagesOptions={languagesOptions}
			licenseValid={licenseValid}
			onClose={fetchThesauri}
			servicesBaseUrl={servicesBaseUrl}
			setLicensedTo={setLicensedTo}
			setLicenseValid={setLicenseValid}
		/>
	</>;
} // ThesauriList


export function Thesauri(props) {
	//console.debug('Thesauri props', props);
	const {
		licenseValid,
		servicesBaseUrl,
		setLicensedTo,
		setLicenseValid
	} = props;
	//console.debug('Thesauri licenseValid', licenseValid);
	return <>
		<Header as='h1'>Thesauri</Header>
		<ThesauriList
			licenseValid={licenseValid}
			servicesBaseUrl={servicesBaseUrl}
			setLicensedTo={setLicensedTo}
			setLicenseValid={setLicenseValid}
		/>
	</>;
}
