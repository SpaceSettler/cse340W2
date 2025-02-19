INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
)

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'

DELETE FROM public.account
	WHERE account_firstname = 'Tony'

UPDATE public.inventory
SET inv_description = REPlACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10

SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
	ON classification_name = 'Sport'

UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, 'es/', 'es/vehicles/'),
	inv_image = REPLACE(inv_image, 'es/', 'es/vehicles/')