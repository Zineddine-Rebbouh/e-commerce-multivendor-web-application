const Event = require("../models/Events")

const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, image } = req.body

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      image,
    })

    await newEvent.save()

    res.status(200).json("Event created")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()

    res.status(200).json(events)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    res.status(200).json(event)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const updateEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, image } = req.body

    const event = await Event.findById(req.params.id)

    event.title = title
    event.description = description
    event.date = date
    event.time = time
    event.location = location
    event.image = image

    await event.save()

    res.status(200).json("Event updated")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)

    res.status(200).json("Event deleted")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
}
