FROM ibmcom/ibmnode

	ADD . /app

	ENV NODE_ENV production
	ENV PORT 8080

	EXPOSE 8080

	WORKDIR "/app"

	CMD ["npm", "start"]
