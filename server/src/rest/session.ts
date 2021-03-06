import { appController } from '../app-controller'
import { captchaValidateValidator } from '../validator/captcha-validate'
import { CaptchaFinishResponse } from '@shared/rest'
import { asyncRoute } from '../async-route'

export const sessionApi = appController((router, { sessions, kaptcha }) => {
	router.get(
		'/:id',
		asyncRoute(async (req, res) => {
			const id = req.params['id']

			if (!id) {
				throw new Error('Id is required')
			}

			const session = await sessions.get(id)

			if (!session) {
				res.status(404).send()
			} else {
				res.json(session)
			}
		})
	)

	router.post(
		'/',
		asyncRoute(async (_req, res) => {
			const captcha = await kaptcha.create()

			res.json({
				captcha: captcha.id,
			})
		})
	)

	router.post(
		'/captcha',
		asyncRoute(async (req, res) => {
			const { value: data, error } = captchaValidateValidator.validate(req.body)

			if (!data || error) {
				throw error
			}

			if (data.results.length !== kaptcha.steps) {
				throw new Error('Invalid results length')
			}

			for (let i = 0; i < data.results.length; i++) {
				const valid = await kaptcha.validate(
					data.captcha,
					i,
					data.results[i].x,
					data.results[i].y
				)

				if (!valid) {
					await kaptcha.clear(data.captcha)

					return res.json({
						ok: false,
					} as CaptchaFinishResponse)
				}
			}

			await kaptcha.clear(data.captcha)

			const session = await sessions.create()

			res.json({
				ok: true,
				session: session.id,
				pixels: session.pixels,
			} as CaptchaFinishResponse)
		})
	)
})
