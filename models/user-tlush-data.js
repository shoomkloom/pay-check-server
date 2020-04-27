const mongoose = require('mongoose');
const Joi = require('joi');

const userTlushDataSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true
    },
    periodyear: {
        type: Number,
        required: true
    },
    periodmonth: {
        type: Number,
        required: true
    },
    fronthtml: {
        type: String,
        required: true
    },
    backhtml: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    },
    basics: {
		salaryPeriod: {
            type: String
        },
		semelMosad: {
            type: String
        }
	},
	personalInformation: {
		id: {
            type: String
        },
		firstName: {
            type: String
        },
		lastName: {
            type: String
        },
		darga: {
            type: String
        },
		derugOfek: {
            type: String
        },
		dargaOfek: {
            type: String
        },
		vetek: {
            type: String
        },
		vetekZahal: {
            type: String
        },
		vetekOfek: {
            type: String
        },
		dateBeginning: {
            type: String
        }
	},
	tashlumeem: [
		{
			semel: {
                type: String
            },
			from: {
                type: String
            },
			to: {
                type: String
            },
			percent: {
                type: String
            },
			teur: {
                type: String
            },
			monthlySum: {
                type: String
            },
			hefreshim: {
                type: String
            },
		}
	],
	netuneiMas: {
		family: {
            type: String
        },
		pointsForKids: {
            type: String
        },
		spouseWorking: {
            type: String
        },
		points: {
            type: String
        },
		pointsValue: {
            type: String
        },
		masShuliPercentage: {
            type: String
        },
		minimumForJob: {
            type: String
        },
		minimumForHour: {
            type: String
        },
		onlyJob: {
            type: String
        },
		bituahLeumi: {
            type: String
        },
	},
	gemel: [
		{
			kupa: {
                type: String
            },
			from: {
                type: String
            },
			to: {
                type: String
            },
			basisForGemel: {
                type: String
            },
			pitzueem: {
                type: String
            },
			gemel: {
                type: String
            },
			nikuiOved: {
                type: String
            },
		}
	],
	mekadmim: {
		misraKlali: {
            type: String
        },
		misraOfek: {
            type: String
        },
		havraa: {
            type: String
        },
		workHours: {
            type: String
        },
		workHoursActuallyWorked: {
            type: String
        },
		mother: {
            type: String
        },
	},
	masHachnasa: {
        type: String
    },
	bituahLeumi: {
        type: String
    },
	bituahBriut: {
        type: String
    },
	hefresheiBituahLeumi: {
        type: String
    },
	hefresheiBituahBriut: {
        type: String
    },
	tashlumeemTotal: {
        type: String
    },
	nikuyeyHova: {
        type: String
    },
	gemelTotal: {
        type: String
    }
},{collection: 'usertlushdatas'});

const UserTlushData = mongoose.model('UserTlushData', userTlushDataSchema, 'usertlushdatas');

//Utilities
function validateUserTlushData(userTlushData){
    const userTlushDataSchema = {
        userid: Joi.string().required(),
        periodyear: Joi.number().required(),
        periodmonth: Joi.number().required(),
        fronthtml: Joi.string().required(),
        backhtml: Joi.string().required()
    }
    return Joi.validate(userTlushData, userTlushDataSchema);
};

exports.UserTlushData = UserTlushData;
exports.validateUserTlushData = validateUserTlushData;
exports.userTlushDataSchema = userTlushDataSchema;