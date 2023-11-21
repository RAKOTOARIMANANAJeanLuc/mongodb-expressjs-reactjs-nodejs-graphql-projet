const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");


const events = eventIds => {
    return Event
            .find({ _id: {$in: eventIds} })
            .then(events => {
                return events.map(event => {
                    return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator) };
                });
            })
            .catch(err => {
                throw err;
            });
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => ({
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }));
        } catch (err) {
            throw err;
        }
    },
    bookings: async args => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => ({
                ...booking._doc,
                _id: booking.id,
                createdAt: new Date(booking.createdAt).toISOString(),
                updatedAt: new Date(booking.updatedAt).toISOString()
            }));
        } catch(err => {
            throw err;
        })
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "655c6fd1b9f75b0903e5020a"
        });

        let createdEvent;

        try {

            const result = await event.save();

            createdEvent = { 
                ...result._doc, 
                _id: result.id,  
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) 
            };

            const creator = await User.findById("655c6fd1b9f75b0903e5020a");

            if (!creator) {
                throw new Error("L'utilisateur n'existe pas");
            }

            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {
                throw new Error("L'utilisateur existe déjà");
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();
            return { ...result._doc, _id: result.id };
        } catch (err) {
            throw err;
        }
    }
};