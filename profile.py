import geni.portal as portal
import geni.rspec.pg as pg
import geni.rspec.igext as IG

pc = portal.Context()
request = pc.makeRequestRSpec()

tourDescription = \
    """
This profile provides the template for 3 compute nodes with Docker and Kubernetes installed on Ubuntu 18.04
"""

#
# Setup the Tour info with the above description and instructions.
#
tour = IG.Tour()
tour.Description(IG.Tour.TEXT, tourDescription)
request.addTour(tour)

prefixForIP = "192.168.1."
link = request.LAN("lan")

node = request.XenVM("main")
bs_landing = node.Blockstore("bs_image", "/image")
bs_landing.size = "500GB"
node.cores = 4
node.ram = 8192
node.routable_control_ip = "true"
node.disk_image = "urn:publicid:IDN+emulab.net+image+emulab-ops:UBUNTU18-64-STD"
iface = node.addInterface("if" + str(1))
iface.component_id = "eth1"
iface.addAddress(pg.IPv4Address(prefixForIP + str(1), "255.255.255.0"))
link.addInterface(iface)

# setup Docker
node.addService(pg.Execute(
    shell="sh", command="sudo bash /local/repository/install_docker.sh"))
# setup Kubernetes
node.addService(pg.Execute(
    shell="sh", command="sudo bash /local/repository/install_kubernetes.sh"))
node.addService(pg.Execute(shell="sh", command="sudo swapoff -a"))

node.addService(pg.Execute(
    shell="sh", command="sudo bash /local/repository/kube_manager.sh"))

pc.printRequestRSpec(request)
