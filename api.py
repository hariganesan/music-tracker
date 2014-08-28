# Hari Ganesan 12/21/13
# main file for track-music

import os
import logging
import json

import webapp2

#########################
# Static Handlers
#########################

# main routes to static pages
class MainPageHandler(webapp2.RequestHandler):
	def get(self):
		with open("templates/index.html") as index_file:
			html = index_file.read()

		self.response.write(html)


app = webapp2.WSGIApplication([
	('/.*$', MainPageHandler)
], debug=True)