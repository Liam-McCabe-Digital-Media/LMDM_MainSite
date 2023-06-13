const ShipEngine = require('shipengine');
const shipengine = new ShipEngine('TEST_m/sAspxYPgrdX/zzoCu8XfoW2obSP4D3PRpydm6LoI0');

module.exports.getRatesWithShipmentDetails = async (shipTo, shipFrom) => {
	const params = {
		rateOptions: {
			//test UPS
			carrierIds: ['se-4800261'],
		},
		shipment: {
			validateAddress: 'no_validation',
			// shipTo: {
			// 	name: 'Liam McCabe',
			// 	phone: '555-555-5555',
			// 	addressLine1: '1007 Banner Ridge Rd',
			// 	cityLocality: 'Diamond Bar',
			// 	stateProvince: 'CA',
			// 	postalCode: '91765',
			// 	countryCode: 'US',
			// 	addressResidentialIndicator: 'yes',
			// },
			shipTo,
			shipFrom,
			// shipFrom: {
			// 	name: 'Leo McCabe',
			// 	phone: '111-111-1111',
			// 	addressLine1: '846 E Holt Ave',
			// 	// addressLine2: 'Suite 300',
			// 	cityLocality: 'Pomona',
			// 	stateProvince: 'CA',
			// 	postalCode: '91767',
			// 	countryCode: 'US',
			// 	addressResidentialIndicator: 'yes',
			// },
			packages: [
				{
					weight: {
						value: 1.0,
						unit: 'pound',
					},
				},
			],
		},
	};

	try {
		const result = await shipengine.getRatesWithShipmentDetails(params);

		console.log('The rates that were created:');
		//console.log(result);
		// console.log(result.rateResponse.rates);
		const params2 = {
			rateId: 'se-3107699475',
			validateAddress: 'no_validation',
			labelLayout: '4x6',
			labelFormat: 'pdf',
			labelDownloadType: 'url',
			displayScheme: 'label',
		};
		// const label = await shipengine.createLabelFromRate(params2);
		console.log(result);
		return result.rateResponse.rates;
		// console.log(result.rateResponse.rates);
	} catch (e) {
		console.log('Error creating rates: ', e.message);
	}
};

module.exports.verifyAddress = async (address) => {
	let verifiedAddress = {
		name: `${address.firstName} ${address.lastName}`,
		phone: address.phone,
		company_name: address.companyName,
		address_line1: address.street,
		address_line2: address.streetTwo,
		address_line3: address.streetThree,
		city_locality: address.city,
		state_province: address.state,
		country_code: 'US',
		address_residential_indicator: 'unknown',
	};
};
