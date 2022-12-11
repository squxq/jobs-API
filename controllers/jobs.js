const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index')

const getAllJobs = async (req, res) => {
  const jobs = await Job
    .find({ createdBy: req.user.userId })
    .sort('createdAt')

  res
    .status(StatusCodes.OK)
    .json({ count: jobs.length, jobs })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId

  const job = await Job.create(req.body)

  res
    .status(StatusCodes.CREATED)
    .json({ job })
}

const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}.`)
  }

  res
    .status(StatusCodes.OK)
    .json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: data,
    user: { userId },
    params: { id: jobId },
  } = req

  if (!data) {
    throw new BadRequestError('Company or Position fields cannot be empty.')
  }
  const job = await Job.findByIdAndUpdate(
    { 
      _id: jobId, 
      createdBy: userId, 
    },
    data,
    { 
      new: true, 
      runValidators: true, 
    }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}.`)
  }
  res
    .status(StatusCodes.OK)
    .json({ job })
}

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}
      .`)
  }
  res
    .status(StatusCodes.OK)
    .json({
      task: null,
      status: `success`,
    })
}

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
}
