const request = require('supertest');
const app = require('../server');
const { disconnectRedis } = require('../database/index');
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU4ODI0ODI1fQ.YzpCOgB7VDl0VkkV8e4Ska6ZyVHepasRpRvfZoM3jBk';

function generateString() {
    const characters = '1234567890';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
afterEach(() => {
    app.close();
});
describe('Auth API', () => {
    it("GET / --> CheckIfUserExists ", () => {
        /* return request(app)
             .get(`/api/v1/auth/CheckIfUserExists`)
             .send({ phonenumber: '+212636047860' })
             .expect(200)
             .then((response) => {
                 expect(response).toEqual(
                     expect.objectContaining({
                         already: expect.any(Boolean)
                     })
                 );
             });*/

    });

    it("GET / --> VerifyNumber ", () => {
        return request(app)
            .get('/api/v1/auth/VerifyNumber')
            .send({
                phonenumber: '+212636047860',
                key: "777777"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        Verified: expect.any(Boolean)
                    })
                );
            });
    });
    it("POST / --> login", () => {
        return request(app)
            .post('/api/v1/auth/')
            .send({
                phonenumber: '+212636047860',
                key: "777777"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        Verified: expect.any(Boolean)
                    })
                );
            });
    });

    it("POST / --> regester ", () => {
        return request(app)
            .post('/api/v1/auth/regester')
            .send({ phonenumber: `+2126360#${generateString()}`, FullName: `User#${generateString()}`, adrress: `adrress#${generateString()}` })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        accesToken: expect.any(String),
                        RefreshToken: expect.any(String)
                    })
                );
            });
    });
    it("POST / --> ResendOTP ", () => {
        return request(app)
            .get('/api/v1/auth/Verify')
            .send({ phonenumber: '+212636047860' })
            .expect([200, 404]);
    });
    it("POST / --> driverRegester ", () => {
        return request(app)
            .post('/api/v1/auth/driverRegester')
            .send({
                FullName: `User#${generateString()}`,
                phoneNumber: `+2126360#${generateString()}`,
                adrress: "",
                nationality: "",
                identity_card: "",
                license: "",
                vehicle_register_number: "",
                plate_number: "",
                identity_card_photo_front: "",
                identity_card_photo_back: "",
                lecense_photo: "",
                vehicle_type_id: 1
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        accesToken: expect.any(String),
                        RefreshToken: expect.any(String)
                    })
                );
            });
    });
    it("POST / --> UploadDocument ", () => {

    });
});

describe('USERS API', () => {
    it("GET / --> specific User by id", () => {
        return request(app)
            .get('/api/v1/user/')
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });

    it("GET / --> get Users ", () => {
        return request(app)
            .get('/api/v1/user/Users')
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });

    it("POST / --> Update Users ", () => {
        return request(app)
            .post('/api/v1/user/')
            .set('authorization', `Bearer ${token}`)
            .expect(200);

    });
    it("POST / --> Send SMS OTP ", () => {
        return request(app)
            .post('/api/v1/user/SendOtp')
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });

    it("POST / --> Update PhoneNumber ", () => {
        // return request(app)
        //     .post('/api/v1/user/UpdatePhoneNumber')
        //     .set('authorization', `Bearer ${token}`)
        //     .send({
        //         phonenumber: "",
        //         Otp: ""
        //     })
        //     .expect(200);
    });
    it("GET / --> GET ALL USER ORDERS ", () => {
        return request(app)
            .post('/api/v1/user/GetOrderStatus')
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });


});

describe('Order API', () => {
    it("POST / --> Order", () => {
        return request(app)
            .post('/api/v1/order/')
            .set('authorization', `Bearer ${token}`)
            .send({
                Driver_ID: 2,
                Date_of_Order: '2022-07-12',
                Distination: '',
                location: '',
                viecle_Id: 1,
                trailer_id: 1,
                Current_Location: '',
                Order_Type: 'Single',
                Order_Start_Time: '2022-07-12'
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number)
                    })
                )
            });

    });
    it("POST / --> AcceptOrder", () => {
        return request(app)
            .post('/api/v1/order/AcceptOrder')
            .set('authorization', `Bearer ${token}`)
            .send({
                id: 1
            })
            .expect(200)
            .then((response) => {

            });
    });
    it("POST / --> CancelOrder ", () => {
        return request(app)
            .post('/api/v1/order/CancelOrder')
            .set('authorization', `Bearer ${token}`)
            .send({
                id: 1
            })
            .expect(200).then((response) => {

            });
    });
    it("POST / --> CompleteOrder ", () => {
        return request(app)
            .post('/api/v1/order/CompleteOrder/')
            .set('authorization', `Bearer ${token}`)
            .send({
                id: 1
            })
            .expect(200).then((response) => {

            });
    });
    it("POST / --> UpdateLocation ", () => {
        return request(app)
            .post('/api/v1/order/UpdateLocation/')
            .set('authorization', `Bearer ${token}`)
            .send({
                location: 'new Loc',
                id: 1
            })
            .expect(200).then((response) => {

            });
    });
    it("GET / --> GetOrderStatus ", () => {
        return request(app)
            .post('/api/v1/order/GetOrderStatus/')
            .set('authorization', `Bearer ${token}`)
            .send({
                id: 1
            })
            .expect(200).then((response) => {

            });
    });
});