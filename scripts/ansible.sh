#!/bin/bash

ansible-playbook --connection=local -e "ansible_port=2200" /var/www/morse/ansible/playbook.yml -i localhost,